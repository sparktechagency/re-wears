import { model, Schema } from "mongoose";
import { IUserFollower } from "./follower.interface";

const userFollowerSchema = new Schema<IUserFollower>({
    id: {
        type: String,
    },
    user: {
        type: String,
        required: true,
    },
    follower: {
        type: [String],
        required: true,
    }
}, {
    timestamps: true,
});

export const UserFollower = model<IUserFollower>("Follower", userFollowerSchema);
