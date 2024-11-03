import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
// app.use(limiter);

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

import userRoute from "./routes/user.routes.js";

app.use("/api/v1/user",userRoute);

export { app };