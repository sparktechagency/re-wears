// import passport from 'passport';
// import express from 'express';
// import { AuthService } from '../auth/auth.service';
// import config from '../../../config';

// const router = express.Router();

// // Google OAuth Routes
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// router.get(
//     '/google/callback',
//     passport.authenticate('google', { failureRedirect: '/login' }),
//     async (req, res) => {
//         const result = await AuthService.socialLoginFromDB(req.user);
//         res.redirect(`${config.frontendUrl}/auth/success?token=${result.accessToken}`);
//     }
// );

// // Apple OAuth Routes
// router.get('/apple', passport.authenticate('apple'));

// router.get(
//     '/apple/callback',
//     passport.authenticate('apple', { failureRedirect: '/login' }),
//     async (req, res) => {
//         const result = await AuthService.socialLoginFromDB(req.user as any);
//         res.redirect(`${config.frontendUrl}/auth/success?token=${result.accessToken}`);
//     }
// );

// export const AuthRoutes = router;