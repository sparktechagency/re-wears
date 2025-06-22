
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as AppleStrategy } from "passport-apple";
import config from ".";
import { User } from "../app/modules/user/user.model";

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: config.google.clientID as string,
    clientSecret: config.google.clientSecret as string,
    callbackURL: config.google.callbackURL as string,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await User.findOne({ email: profile.emails?.[0].value });
        if (existingUser) {
            done(null, existingUser);
        } else {
            const newUser = await User.create({
                email: profile.emails?.[0].value,
                name: profile.displayName,
                provider: 'google',
                providerId: profile.id,
                isVerified: true
            });
            done(null, newUser);
        }
    } catch (error) {
        done(error, undefined);
    }
}));

// Apple OAuth Strategy
// passport.use(new AppleStrategy({
//     clientID: config.apple.clientID as string,
//     teamID: config.apple.teamID as string,
//     keyID: config.apple.keyID as string,
//     privateKey: config.apple.privateKey as string,
//     callbackURL: config.apple.callbackURL as string,
//     passReqToCallback: true
// }, async (req, accessToken, refreshToken, profile, done) => {
//     try {
//         const existingUser = await User.findOne({ email: profile.emails?.[0].value });
//         if (existingUser) {
//             done(null, existingUser);
//         } else {
//             const newUser = await User.create({
//                 email: profile.emails?.[0].value,
//                 name: profile.displayName,
//                 provider: 'apple',
//                 providerId: profile.id,
//                 isVerified: true
//             });
//             done(null, newUser);
//         }
//     } catch (error) {
//         done(error, undefined);
//     }
// }));

// Serialize & Deserialize User
passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;