import { Auth, DecodedIdToken, UserRecord } from "firebase-admin/auth";
import { Role } from "../entity/User";
import { auth } from "../firebaes";

export class FirebaseAuthService {
  private auth: Auth;
  constructor() {
    this.auth = auth;
  }

  public async verifyIdToken(idToken: string): Promise<DecodedIdToken> {
    try {
      return await this.auth.verifyIdToken(idToken);
    } catch (error) {
      console.error("Error verifying ID token:", error);
      throw error;
    }
  }

  public async getUser(uid: string): Promise<UserRecord> {
    try {
      return await this.auth.getUser(uid);
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }

  public async createUser(
    email: string,
    password: string,
    role: Role
  ): Promise<UserRecord> {
    try {
      const newUser = await this.auth.createUser({
        email,
        password,
      });
      // set custom claims
      await this.addClaims(newUser.uid, { role });
      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async deleteUser(uid: string) {
    try {
      await this.auth.deleteUser(uid);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  public async addClaims(uid: string, claims: { [key: string]: any }) {
    try {
      await this.auth.setCustomUserClaims(uid, claims);
    } catch (error) {
      console.error("Error adding claims:", error);
      throw error;
    }
  }
}
