import { Role, User } from "../entity/User";
import { UserRepository } from "../repository/UserRepository";
import { FirebaseAuthService } from "./FirebaseAuthService";

export class UserServices {
  constructor(private firebaseAuthService: FirebaseAuthService) {}
  async createUser(createdBy: string, email: string, role: Role, name: string) {
    try {
      // validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email format!");
      }

      // verify creator and duplicate email in a single query
      const [user, existingUser] = await Promise.all([
        UserRepository.findOne({ where: { id: createdBy } }),
        UserRepository.findOne({ where: { email: email } }),
      ]);

      if (!user) {
        throw new Error("User not found");
      }

      if (existingUser) {
        throw new Error("User with that email already exists");
      }

      // Create a new user in firebase
      const firebaesUser = await this.firebaseAuthService.createUser(
        email,
        process.env.DEFAULT_USER_PASSWORD,
        role
      );

      // Save the user in the database
      const newUser = new User();
      newUser.id = firebaesUser.uid;
      newUser.email = email;
      newUser.createdBy = createdBy;
      newUser.role = role;
      newUser.name = name;

      const savedUser = await UserRepository.save(newUser);

      return savedUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async getUserByCreatedBy(createdBy: string, page: number, limit: number) {
    try {
      return await UserRepository.createQueryBuilder("user")
        .where("user.role != :role", { role: Role.ADMIN })
        .andWhere("user.createdBy = :createdBy", { createdBy })
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  async getUsers(page: number, limit: number, role?: Role) {
    try {
      const users = UserRepository.createQueryBuilder("user")
        .where("user.role != :role", { role: Role.ADMIN })
        .skip((page - 1) * limit)
        .take(limit);

      if (role) {
        users.andWhere("role = :role", { role });
      }

      return await users.getMany();
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  async getUserById(id: string, createdBy: string) {
    try {
      return await UserRepository.findOne({ where: { id, createdBy } });
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  async updateUser(
    createdBy: string,
    id: string,
    email?: string,
    name?: string
  ) {
    try {
      const user = await UserRepository.findOne({ where: { id, createdBy } });

      if (!user) {
        throw new Error("User not found");
      }

      user.email = email;
      user.name = name;

      return await UserRepository.save(user);
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  async deleteUser(createdBy: string, id: string) {
    try {
      const user = await UserRepository.findOne({ where: { id, createdBy } });

      if (!user) {
        throw new Error("User not found");
      }

      // delete from firebase
      await this.firebaseAuthService.deleteUser(id);

      // delete from database
      await UserRepository.softRemove(user);

      return;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  async addClaims(uid: string, claims: { [key: string]: any }) {
    try {
      await this.firebaseAuthService.addClaims(uid, claims);
    } catch (error) {
      console.error("Error adding claims:", error);
      throw error;
    }
  }
}
