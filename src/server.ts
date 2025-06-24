import mongoose from "mongoose";
import app from "./app";
import config from "./config";
import { errorLogger, logger } from "./shared/logger";
import colors from 'colors';
import { socketHelper } from "./helpers/socketHelper";
import { Server } from "socket.io";
import seedSuperAdmin from "./DB";
import { deleteUnverifiedAccount } from "./shared/deleteUnverifiedAccount";
import { scheduleProductStatusCron } from "./helpers/product.cron";

process.on('uncaughtException', error => {
    errorLogger.error('uncaughtException Detected', error);
    process.exit(1);
});

let server: any;
let io: Server;

async function main() {
    try {
        seedSuperAdmin();
        deleteUnverifiedAccount();
        scheduleProductStatusCron();

        await mongoose.connect(config.database_url as string);
        logger.info(colors.green('🚀 Database connected successfully'));

        const port = typeof config.port === 'number' ? config.port : Number(config.port);

        server = app.listen(port, config.ip_address as string, () => {
            logger.info(colors.yellow(`♻️  Application listening on port:${config.port}`));
        });

        io = new Server(server, {
            pingTimeout: 60000,
            cors: {
                origin: '*'
            }
        });

        socketHelper.socket(io);

    } catch (error) {
        errorLogger.error(colors.red('🤢 Failed to connect Database'), error);
    }

    process.on('unhandledRejection', error => {
        if (server) {
            server.close(() => {
                errorLogger.error('UnhandledRejection Detected', error);
                process.exit(1);
            });
        } else {
            process.exit(1);
        }
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
        logger.info('SIGTERM IS RECEIVED');

        try {
            if (io) {
                await io.close();
                logger.info('Socket.io server closed');
            }
            if (server) {
                server.close(() => {
                    logger.info('HTTP server closed');
                    process.exit(0);
                });
            }
        } catch (err) {
            errorLogger.error('Error during shutdown', err);
            process.exit(1);
        }
    });
}

main();
