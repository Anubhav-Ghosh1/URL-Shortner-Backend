import { URL } from "../models/url.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { v4 as uuidv4 } from "uuid";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const createURL = asyncHandler(async (req, res) => {
    try {
        const id = req?.user?._id;
        const { originalURL, isActive, customAlias } = req.body;

        if (!originalURL) {
            return res
                .status(400)
                .json(new ApiError(400, "All fields are required"));
        }

        let shortnedURL = "";
        if (customAlias) {
            const existingAlias = await URL.findOne({
                customAlias: customAlias,
            });
            if (existingAlias) {
                return res
                    .status(400)
                    .json(new ApiError(400, "Alias already used"));
            }
            shortnedURL = customAlias;
            shortnedURL += "-";
        }
        shortnedURL += uuidv4();

        const url = await URL.create({
            shortnedURL,
            originalURL,
            isActive: isActive !== undefined ? isActive : false,
            userId: id,
            visitorCount: 0,
        });

        const user = await User.findByIdAndUpdate(id, {
            $push: {
                url: url._id,
            },
        });

        return res
            .status(200)
            .json(new ApiResponse(200, url, "URL created successfully"));
    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json(new ApiResponse(500, {}, "Error while creating url"));
    }
});

const deleteURL = asyncHandler(async (req, res) => {
    try {
        const id = req?.user?._id;
        const { urlId } = req.body;
        if (!urlId) {
            return res
                .status(400)
                .json(new ApiResponse(400, {}, "All fields are required"));
        }

        const exisitingURL = await URL.findByIdAndDelete(
            new mongoose.Types.ObjectId(urlId)
        );
        if (!exisitingURL) {
            return res
                .status(500)
                .json(new ApiResponse(500, {}, "URL doesnot exist"));
        }

        const user = await User.findByIdAndUpdate(id, {
            $pull: {
                url: new mongoose.Types.ObjectId(urlId),
            },
        });

        return res
            .status(200)
            .json(
                new ApiResponse(200, exisitingURL, "URL deleted successfully")
            );
    } catch (e) {
        return res
            .status(500)
            .json(new ApiResponse(500, {}, "Error while deleting URL"));
    }
});

const redirectURL = asyncHandler(async (req, res) => {
    try {
        const { shortnedURL } = req.params;

        if (!shortnedURL) {
            return res
                .status(400)
                .json(new ApiResponse(400, {}, "All fields are required"));
        }

        // Find the URL document by the shortened URL
        const urlEntry = await URL.findOne({ shortnedURL });

        // If no entry is found, return an error
        if (!urlEntry || !urlEntry.isActive) {
            return res
                .status(404)
                .json(new ApiError(404, "URL not found or is inactive"));
        }

        // Increment the visitor count
        urlEntry.visitorCount += 1;
        await urlEntry.save();

        // Redirect to the original URL
        return res.redirect(urlEntry.originalURL);
    } catch (e) {
        return res
            .status(500)
            .json(new ApiResponse(500, {}, "Error while redirecting URL"));
    }
});

const getURLDetails = asyncHandler(async (req, res) => {
    try {
        const { urlId } = req.params;
        if (!urlId) {
            return res
                .status(400)
                .json(new ApiResponse(400, {}, "All fields are required"));
        }

        const url_details = await URL.findById(
            new mongoose.Types.ObjectId(urlId)
        );
        if (!url_details) {
            return res
                .status(500)
                .json(new ApiResponse(500, {}, "Error while fetching details"));
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    url_details,
                    "Details fetched successfully"
                )
            );
    } catch (e) {
        return res
            .status(500)
            .json(new ApiResponse(500, {}, "Error while fetching data"));
    }
});

// const updateURL = asyncHandler(async (req, res) => {
//     try {
//         const { urlId } = req.body;
//         const { originalURL, isActive, customAlias } = req.body;
//         const updatedValues = {};
//         if (originalURL) {
//             updatedValues.originalURL = originalURL;
//         }
//         if (isActive) {
//             updatedValues.isActive = isActive;
//         }
//         if (customAlias) {
//             updatedValues.customAlias = customAlias;
//         }

//         const exisitingURL = await URL.findById(
//             new mongoose.Types.ObjectId(urlId)
//         );

//         if (!exisitingURL) {
//             return res
//             .status(500)
//             .json(new ApiResponse(500, {}, "URL doesnot exist"));
//         }

//         if(customAlias)
//         {
//             let shortnedUrl = exisitingURL.shortnedURL;
//             updatedValues.shortnedURL = shortnedUrl.replace(exisitingURL.customAlias,customAlias)
//         }
//         console.log(updatedValues);

//         const url = await URL.findByIdAndUpdate(
//             exisitingURL._id,
//             updatedValues,
//             { new: true }
//         );

//         return res
//             .status(200)
//             .json(new ApiResponse(200, url, "URL updated successfully"));
//     } catch (e) {
//         return res
//             .status(500)
//             .json(new ApiResponse(500, {}, "Error while updating URL"));
//     }
// });

const updateURL = asyncHandler(async (req, res) => {
    try {
        const { urlId } = req.body;
        const { originalURL, isActive, customAlias } = req.body;
        const updatedValues = {};

        // Apply updates for provided fields
        if (originalURL) updatedValues.originalURL = originalURL;
        if (isActive !== undefined) updatedValues.isActive = isActive;
        // Retrieve the existing URL document
        const existingURL = await URL.findById(
            new mongoose.Types.ObjectId(urlId)
        );

        if (!existingURL) {
            return res
                .status(404)
                .json(new ApiResponse(404, {}, "URL does not exist"));
        }
        // If a custom alias is provided, replace the alias part of the shortnedURL
        if (customAlias) {
            const aliasExists = await URL.findOne({ customAlias });

            if (aliasExists) {
                return res
                    .status(400)
                    .json(new ApiError(400, "Alias already used"));
            }

            // Replace the alias part in the shortnedURL, retaining the UUID suffix
            const uuidSuffix = existingURL.shortnedURL.split("-");
            const Suffix = uuidSuffix.slice(1).join("-");
            updatedValues.shortnedURL = `${customAlias}-${Suffix}`;
            updatedValues.customAlias = customAlias;
        }
        // Update the URL with new values
        const url = await URL.findByIdAndUpdate(
            existingURL._id,
            updatedValues,
            { new: true }
        );

        return res
            .status(200)
            .json(new ApiResponse(200, url, "URL updated successfully"));
    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json(new ApiResponse(500, {}, "Error while updating URL"));
    }
});

const getAllURLByUser = asyncHandler(async (req, res) => {
    try {
        const id = req?.user?._id;
        if (!id) {
            return res
                .status(400)
                .json(new ApiResponse(400, {}, "All fields are required"));
        }

        const urls = await URL.find({ userId: id });
        return res
            .status(200)
            .json(new ApiResponse(200, urls, "URL's fetched successfully"));
    } catch (e) {
        return res
            .status(500)
            .json(new ApiResponse(500, {}, "Error while fetching url's"));
    }
});

const toggleURLStatus = asyncHandler(async (req, res) => {
    try {
        const { urlId } = req.body;

        const url = await URL.findById(new mongoose.Types.ObjectId(urlId));

        if (!url) {
            return res
                .status(400)
                .json(new ApiResponse(400, {}, "Error while fetching details"));
        }

        url.isActive = !url.isActive;
        await url.save();

        return res
            .status(200)
            .json(new ApiResponse(200, url, "URL status updated successfully"));
    } catch (e) {
        return res
            .status(500)
            .json(new ApiResponse(500, {}, "Error while updating URL status"));
    }
});

const trackVisit = asyncHandler(async (req, res) => {
    try {
        const { shortnedURL } = req.params;
        const urlEntry = await URL.findOne({ shortnedURL });

        if (!urlEntry || !urlEntry.isActive) {
            return res
                .status(404)
                .json(new ApiError(404, "URL not found or inactive"));
        }
        const ipAddress =
            req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;
        // Log visit details
        const visitorInfo = {
            ipAddress: ipAddress,
            userAgent: req.headers["user-agent"],
            accessedAt: new Date(),
        };
        urlEntry.visitorDetails.push(visitorInfo);
        urlEntry.visitorCount += 1;
        await urlEntry.save();

        // Redirect to the original URL
        res.redirect(urlEntry.originalURL);
    } catch (e) {
        res.status(500).json(new ApiResponse(500, {}, "Error tracking visit"));
    }
});

export {
    createURL,
    redirectURL,
    getURLDetails,
    toggleURLStatus,
    trackVisit,
    getAllURLByUser,
    updateURL,
    deleteURL,
};
