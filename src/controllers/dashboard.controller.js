import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const userAnalytics = asyncHandler(async (req,res) => {
    try
    {
        const id = req?.user?._id;
        if(!id)
        {
            return res.status(400).json(new ApiResponse(400,{},"All fields are required"));
        }

        const response = await User.aggregate([
            {
                $match:
                {
                    _id: id,
                }
            },
            {
                $lookup:
                {
                    from: "urls",
                    foreignField: "userId",
                    localField: "_id",
                    as: "Url",
                }
            },
            {
                $addFields: {
                    totalVisitorCount: { $sum: "$Url.visitorCount" }, // Sum of all visitor counts
                    totalUrls: { $size: "$Url" } // Count of total URLs
                }
            },
            {
                $project:
                {
                    username: 1,
                    totalVisitorCount: 1,
                    totalUrls: 1,
                    Url: {
                        shortnedURL: 1,
                        originalURL: 1,
                        visitorCount: 1,
                        isActive: 1
                    }
                }
            }
        ]);

        return res.status(200).json(new ApiResponse(200,response[0],"User details fetched successfully"));
    }
    catch(e)
    {
        return res.status(500).json(new ApiResponse(500,{},"Error while fetching details"));
    }
});

export {userAnalytics};