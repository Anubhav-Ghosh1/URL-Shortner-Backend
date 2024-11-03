import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { userAnalytics } from "../controllers/dashboard.controller.js";

const router = express.Router();
router.get("/userAnalytics",verifyJWT,userAnalytics);

export default router;