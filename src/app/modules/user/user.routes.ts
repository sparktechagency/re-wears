import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import fileUploadHandler from '../../middlewares/fileUploaderHandler';
const router = express.Router();

router.get(
  "/",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  UserController.getAllUsers
);

router.get(
  "/profile",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
  UserController.getUserProfile
);
  
router.post(
    '/create-admin',
    validateRequest(UserValidation.createAdminZodSchema),
    UserController.createAdmin
);

router.post(
  "/create-user",
  validateRequest(UserValidation.createUserZodSchema),
  UserController.createUser
);

router.patch(
  "/update-profile",
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  fileUploadHandler(),
  UserController.updateProfile
);

router.patch("/:id", UserController.updateUserRole);

router.patch("/block-user/:id", UserController.toggleUserBlocking);

router.delete("/:id", UserController.deleteSingleUser);

export const UserRoutes = router;