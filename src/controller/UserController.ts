import { Request, Response } from "express";
import { Role } from "../entity/User";
import { FirebaseAuthService } from "../service/FirebaseAuthService";
import { UserServices } from "../service/UserServices";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "../utils/constants";

// Create an instance of FirebaseAuthService
const firebaseAuthService = new FirebaseAuthService();

// Create an instance of UserServices
const userServices = new UserServices(firebaseAuthService);

export class UserController {
  async createCustomer(req: Request, res: Response) {
    // only dealers can create customers
    try {
      const dealer = req?.user;

      const { name, email, role } = req.body;

      if (!email || !role) {
        return res.status(400).json({ message: "email and role is required!" });
      }

      if (role !== Role.CUSTOMER) {
        return res
          .status(400)
          .json({ message: "Only customers can be created!" });
      }

      console.log(`Attempting to create user with email: ${email}`);
      const user = await userServices.createUser(dealer.uid, email, role, name);

      res
        .status(201)
        .json({ data: user, message: "User created successfully" });
    } catch (error) {
      console.error("Error in userRouter:", error);
      res
        .status(500)
        .json({ message: "Error creating user", error: error.message });
    }
  }

  async createDealer(req: Request, res: Response) {
    try {
      const admin = req?.user;

      const { name, email, role } = req.body;

      if (!email || !role || !name) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      if (role !== Role.DEALER) {
        return res
          .status(400)
          .json({ message: "Only dealers can be created!" });
      }

      console.log(`Attempting to create user with email: ${email}`);

      const user = await userServices.createUser(admin.uid, email, role, name);

      res
        .status(201)
        .json({ data: user, message: "User created successfully" });
    } catch (error) {
      console.error("Error in userRouter:", error);
      res
        .status(500)
        .json({ message: "Error creating user", error: error.message });
    }
  }

  async getUserByCreatedBy(req: Request, res: Response) {
    try {
      const page = req.query.page
        ? parseInt(req.query.page as string)
        : DEFAULT_PAGE_NUMBER;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string)
        : DEFAULT_PAGE_SIZE;

      const user = req?.user;

      const users = await userServices.getUserByCreatedBy(
        user.uid,
        page,
        limit
      );

      res.status(200).json({ data: users });
    } catch (error) {
      console.error("Error in userRouter:", error);
      res
        .status(500)
        .json({ message: "Error fetching users", error: error.message });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const tokenUser = req.user;

      const user = await userServices.getUserById(id, tokenUser.uid);

      res.status(200).json({ data: user });
    } catch (error) {
      console.error("Error in userRouter:", error);
      res
        .status(500)
        .json({ message: "Error fetching user", error: error.message });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const page = req.query.page
        ? parseInt(req.query.page as string)
        : DEFAULT_PAGE_NUMBER;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string)
        : DEFAULT_PAGE_SIZE;

      const users = await userServices.getUsers(page, limit);

      res.status(200).json({ data: users });
    } catch (error) {
      console.error("Error in userRouter:", error);
      res
        .status(500)
        .json({ message: "Error fetching users", error: error.message });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { email, name } = req.body;

      const tokenUser = req.user;

      const user = await userServices.updateUser(
        tokenUser.uid,
        id,
        email,
        name
      );

      res.status(200).json({ data: user });
    } catch (error) {
      console.error("Error in userRouter:", error);
      res
        .status(500)
        .json({ message: "Error updating user", error: error.message });
    }
  }

  async addClaim(req: Request, res: Response) {
    try {
      const { uid } = req.params;

      const user = await userServices.addClaims(uid, { role: Role.ADMIN });

      res
        .status(200)
        .json({ data: user, message: "User updated successfully" });
    } catch (error) {
      console.error("Error in userRouter:", error);
      res
        .status(500)
        .json({ message: "Error updating user", error: error.message });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const tokenUser = req.user;

      await userServices.deleteUser(tokenUser.uid, id);

      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error in userRouter:", error);
      res
        .status(500)
        .json({ message: "Error deleting user", error: error.message });
    }
  }
}
