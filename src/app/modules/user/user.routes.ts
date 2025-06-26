import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import fileUploadHandler from '../../middlewares/fileUploaderHandler';
import "../../../config/passport"
import passport from '../../../config/passport';
import '../../../config/facebookPassport';
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

router.get("/:id", auth(USER_ROLES.USER), UserController.getSingleUser)
router.get('/google', UserController.loginWithGoogle);
// Facebook login route
router.get('/auth/facebook', passport.authenticate('facebook'));

// Facebook callback route
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),  // Redirect to '/' if failed
  UserController.loginWithFacebook  // After successful login, call the controller's function
);

router.patch(
  "/update-profile",
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  fileUploadHandler(),
  UserController.updateProfile
);

router.patch("/:id", UserController.updateUserRole);

router.patch(
  "/block-user/:id",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  UserController.toggleUserBlocking
);
router.patch("/update-user/:id", UserController.updateUserNickName);

router.delete(
  "/:id",
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  UserController.deleteSingleUser
);

export const UserRoutes = router;