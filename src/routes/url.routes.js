import express from "express";
import {
    createURL,
    redirectURL,
    getURLDetails,
    toggleURLStatus,
    trackVisit,
    getAllURLByUser,
    updateURL,
    deleteURL
} from "../controllers/url.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"; // Middleware for protecting routes

const router = express.Router();

// Create a new shortened URL
router.post("/create", verifyJWT, createURL);

// Redirect to the original URL using the shortened URL
router.get("/redirect/:shortnedURL", redirectURL);

// Get details of a specific URL
router.get("/details/:urlId", verifyJWT, getURLDetails);

// Toggle the active status of a specific URL
router.patch("/toggle-status", verifyJWT, toggleURLStatus);

// Track a visit to a URL (increments visit count and logs visitor details)
router.get("/track/:shortnedURL", trackVisit);

// Get all URLs created by a specific user
router.get("/user-urls", verifyJWT, getAllURLByUser);

// Update a specific URL
router.put("/update", verifyJWT, updateURL);

// Delete a specific URL
router.delete("/delete", verifyJWT, deleteURL);

export default router;