import { Router } from "express";
import {
  registerUser,
  loginUser,
  verifyPageRoute, 
  verifyEmail,
  ActuallyResetPassword,
  PasswordResetStuff
  ,getAllUsers
  // ,userProfile
  // ,updateProfile
  // ,deleteProfile
} from "../controllers/userController";
import Auth from "../middlewares/Auth";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/verified", verifyPageRoute);
userRouter.get("/verify/:userId/:uniqueString", verifyEmail);
userRouter.post("/requestPasswordReset", PasswordResetStuff);
userRouter.post("/resetPassword", ActuallyResetPassword);
userRouter.get("/get", getAllUsers);


//nodemailer for to send email
//forgot password
//sign->verf mail
//link->verf email
//const token = crypto.randomBytes(20).toString('hex');
//route to confi email
//get fun
//id
//token
// userRouter.post("/profile",Auth, userProfile);
// userRouter.post("/profileupdate/:id",Auth, updateProfile);
// userRouter.post("/profiledelete/:id",Auth, deleteProfile);

export default userRouter;
