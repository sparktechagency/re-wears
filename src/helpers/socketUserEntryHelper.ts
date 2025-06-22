import { logger } from "../shared/logger";
import { Server } from "socket.io";
import { jwtHelper } from "./jwtHelper";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../app/modules/user/user.model";

const socketUserEntry = (io: Server) => {
    io.on('connection', async (socket) => {
        try {
            const token = socket.handshake.query.token as string;
            if (!token) {
                logger.error('Socket connection rejected: No token provided');
                socket.disconnect();
                return;
            }

            const payload = jwtHelper.verifyToken(token, config.jwt.jwt_secret!) as JwtPayload;
            const userId = payload.id;

            // Update enterTime on connection
            await User.findByIdAndUpdate(userId, { enterTime: new Date() });

            logger.info(`User connected: ${userId}`);

            socket.on('disconnect', async () => {
                // Update leaveTime on disconnect
                await User.findByIdAndUpdate(userId, { leaveTime: new Date() });

                logger.info(`User disconnected: ${userId}`);
            });

        } catch (error) {
            logger.error(`Socket auth error: ${error instanceof Error ? error.message : error}`);
            socket.disconnect();
        }
    });
};


export const socketUserEntryHelper = { socketUserEntry };