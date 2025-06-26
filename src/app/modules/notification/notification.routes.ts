import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { NotificationController } from './notification.controller';
const router = express.Router();

router.get('/',
    auth(USER_ROLES.USER),
    NotificationController.getNotificationFromDB
);
router.get('/admin',
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    NotificationController.adminNotificationFromDB
);

router.get("/all",
    //  auth(USER_ROLES.USER),
    NotificationController.getAllNotification);

router.patch('/',
    auth(USER_ROLES.USER),
    NotificationController.readNotification
);

router.patch(
    '/update-notification/:notificationId',
    auth(USER_ROLES.USER),
    NotificationController.updateNotification
);
// router.patch('/admin',
//     auth(USER_ROLES.USER),
//     NotificationController.adminReadNotification
// );

router.post(
    "/create-admin-notification",
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    NotificationController.createAdminNotification
);

export const NotificationRoutes = router;
