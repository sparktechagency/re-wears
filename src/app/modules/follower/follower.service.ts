import { StatusCodes } from "http-status-codes"
import ApiError from "../../../errors/ApiErrors"
import { UserFollower } from "./follower.model"

const followOrUnfollowUser = async (userId: string, followerId: string) => {
    if (userId === followerId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "You can't follow yourself");
    }

    // Get existing follower document for the user
    let userFollower = await UserFollower.findOne({ user: userId });

    if (!userFollower) {
        // First follow, no document exists yet
        userFollower = await UserFollower.create({
            user: userId,
            follower: [followerId],
        });

        return {
            status: "followed",
            data: userFollower,
        };
    }

    const alreadyFollowing = userFollower.follower.includes(followerId);

    let updated;

    if (alreadyFollowing) {
        // UNFOLLOW: Remove follower
        updated = await UserFollower.findOneAndUpdate(
            { user: userId },
            { $pull: { follower: followerId } },
            { new: true }
        );
        return {
            status: "unfollowed",
            data: updated,
        };
    } else {
        // FOLLOW: Add follower
        updated = await UserFollower.findOneAndUpdate(
            { user: userId },
            { $addToSet: { follower: followerId } },
            { new: true }
        );
        return {
            status: "followed",
            data: updated,
        };
    }
};

const getUserFollowerBaseOnUserIdFromDB = async (userId: string) => {
    const userFollower = await UserFollower.findOne({ user: userId });
    if (!userFollower) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    return userFollower;
};

export const followerService = {
    followOrUnfollowUser,
    getUserFollowerBaseOnUserIdFromDB
}