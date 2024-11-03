import mongoose from "mongoose";

const URLSchema = new mongoose.Schema({
    shortnedURL:
    {
        type: String,
        required: true,
    },
    originalURL:
    {
        type: String,
        required: true,
    },
    userId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    visitorCount:
    {
        type: Number,
        required: true,
    },
    isActive:
    {
        type: Boolean,
        required: true,
        default: true,
    },
    customAlias: {
        type: String,
        required: false,
        unique: true,
        sparse: true, // Only apply uniqueness constraint when alias is present
    },
    visitorDetails: [{
        ipAddress: String,
        userAgent: String,
        accessedAt: {
            type: Date,
            default: Date.now,
        },
    }]
},{new: true});

export const URL = mongoose.model("URL",URLSchema);