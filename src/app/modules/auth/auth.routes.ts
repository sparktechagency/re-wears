import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
import passport from '../../../config/passport'
// import passport from 'passport';
const router = express.Router();

router.post(
    '/login',
    validateRequest(AuthValidation.createLoginZodSchema),
    AuthController.loginUser
);

router.post(
    '/forgot-password',
    validateRequest(AuthValidation.createForgetPasswordZodSchema),
    AuthController.forgetPassword
);

router.post(
    '/refresh-token',
    AuthController.newAccessToken
);

router.post(
    '/resend-otp',
    AuthController.resendVerificationEmail
);

router.post(
    "/verify-otp",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, oneTimeCode } = req.body;

            req.body = { email, oneTimeCode: Number(oneTimeCode) };
            next();
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Failed to convert string to number" });
        }
    },
    validateRequest(AuthValidation.createVerifyEmailZodSchema),
    AuthController.verifyEmail
);

router.post(
    '/reset-password',
    validateRequest(AuthValidation.createResetPasswordZodSchema),
    AuthController.resetPassword
);

router.post(
    '/change-password',
    auth(USER_ROLES.ADMIN, USER_ROLES.USER),
    validateRequest(AuthValidation.createChangePasswordZodSchema),
    AuthController.changePassword
);

// router.post(
//     '/social-login',
//     AuthController.socialLogin
// );

router.delete(
    '/delete-account',
    auth(USER_ROLES.ADMIN),
    AuthController.deleteUser
);


// Google Auth Routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }), (req, res) => {
    res.setHeader('Access-Control-Allow-Origin',"*")
    res.redirect("https://api.re-wears.com/api/v1/auth/google/callback");
});

router.get("/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    AuthController.socialLogin
);

// Facebook Auth Routes
// router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));

// router.get("/facebook/callback",
//     passport.authenticate("facebook", { failureRedirect: "/" }),
//     (req, res) => {
//         res.redirect("/");
//     }
// );



router.delete(
    '/public/delete-account',
    AuthController.deleteUserByEmailAndPassword
);

export const AuthRoutes = router;