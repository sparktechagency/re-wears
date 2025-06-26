import passport from "passport";
import { Strategy as FacebookStrategy } from 'passport-facebook';
import config from ".";
import { User } from "../app/modules/user/user.model";


// facebook OAuth Strategy
// passport.use(new FacebookStrategy({
//     clientID: config.facebook.clientID,
//     clientSecret: config.facebook.clientSecret,
//     callbackURL: 'https://0ffe-115-127-157-41.ngrok-free.app/auth/facebook/callback',
//     profileFields: ['id', 'email', 'name', 'picture']
// }, async (accessToken, refreshToken, profile, done) => {
//     try {
//         let user = await User.findOne({ facebookId: profile.id });

//         if (!user) {
//             user = await User.create({
//                 facebookId: profile.id,
//                 name: profile.displayName,
//                 email: profile.emails ? profile.emails[0].value : '',
//                 profilePicture: profile.photos ? profile.photos[0].value : '',
//             });
//         }

//         // Return the user data
//         return done(null, user);
//     } catch (error) {
//         return done(error, null);
//     }
// }));
passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID!,
    clientSecret: config.facebook.clientSecret!,
    callbackURL: 'https://0ffe-115-127-157-41.ngrok-free.app/auth/facebook/callback',
    profileFields: ['id', 'email', 'name', 'picture'],
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ facebookId: profile.id });

        if (!user) {
            // If the user doesn't exist, create a new user
            user = await User.create({
                facebookId: profile.id,
                name: profile.displayName,
                email: profile.emails ? profile.emails[0].value : '',
                profilePicture: profile.photos ? profile.photos[0].value : '',
            });
        }

        // Pass the user data to the next middleware
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));