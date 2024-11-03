import express from "express";
import {registerUser,loginUser,logoutUser,refreshAccessToken,changeCurrentPassword,getCurrentUser,updateAccountDetails} from "../controllers/user.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/logout",verifyJWT,logoutUser);
router.get("/refreshToken",verifyJWT,refreshAccessToken);
router.patch("/changePassword",verifyJWT,changeCurrentPassword);
router.get("/getUser",verifyJWT,getCurrentUser);
router.patch("/updateAccountDetails",verifyJWT,updateAccountDetails);

export default router;