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
    visitorCount:
    {
        type: Number,
        required: true,
    }
},{new: true});

export const URL = mongoose.model("URL",URLSchema);