import * as express from "express";
import { UserController } from "../controller/UserController";
import { Role } from "../entity/User";
import { authMiddleware } from "../middlewares/AuthMiddleware";

const userRouter = express.Router();

const userController = new UserController();

// create dealers
userRouter.post(
  "/customers",
  authMiddleware([Role.DEALER]),
  userController.createCustomer
);

// create customers
userRouter.post(
  "/dealers",
  authMiddleware([Role.ADMIN]),
  userController.createDealer
);

// get all dealers
userRouter.get(
  "/dealers",
  authMiddleware([Role.ADMIN]),
  userController.getUserByCreatedBy
);

// get all customers
userRouter.get(
  "/customers",
  authMiddleware([Role.DEALER]),
  userController.getUserByCreatedBy
);

// get user
userRouter.get(
  "/:id",
  authMiddleware([Role.DEALER, Role.ADMIN]),
  userController.getUserById
);

// get all users
userRouter.get("/", authMiddleware([Role.ADMIN]), userController.getAllUsers);

// update user
userRouter.put(
  "/:id",
  authMiddleware([Role.DEALER, Role.ADMIN]),
  userController.updateUser
);

// delete user
userRouter.delete(
  "/:id",
  authMiddleware([Role.DEALER, Role.ADMIN]),
  userController.deleteUser
);

// to add custom claim to new admin
// userRouter.put("/addClaim/:uid", userController.addClaim);

export default userRouter;
