import { NextFunction, Request, Response } from "express";
import { Role } from "../entity/User";
import { FirebaseAuthService } from "../service/FirebaseAuthService";

// Extend the Express Request type to include a user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email: string;
        role: Role;
      };
    }
  }
}

// Middleware to check for specific roles
export const authMiddleware = (allowedRoles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "No authorization header provided" });
    }

    // Check if the header starts with "Bearer "
    if (!authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Invalid authorization header format" });
    }

    const token = authHeader.split("Bearer ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const authService = new FirebaseAuthService();
      const decodedToken = await authService.verifyIdToken(token);

      // Attach the user information to the request object
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email || "",
        role: decodedToken.role || "",
      };

      // {{ edit_1 }}: Check if the user's role is in the allowed roles
      if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient permissions" });
      }

      next();
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};
