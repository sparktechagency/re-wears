import passport from "passport";
import { Strategy as FacebookStrategy } from 'passport-facebook';
import config from ".";
import { User } from "../app/modules/user/user.model";

passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID!,
    clientSecret: config.facebook.clientSecret!,
    callbackURL: 'https://8838-115-127-157-41.ngrok-free.app/api/v1/auth/facebook/callback',
    profileFields: ['id', 'email', 'name', 'picture', "gender"]
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const profileData: any = profile._json;
        let user = await User.findOne({ facebookId: profile.id }).lean();

        if (!user) {
            user = await User.create({
                firstName: profileData.first_name || "",
                lastName: profileData.last_name || "",
                email: profile.emails ? profile.emails[0].value : `${profile.id}@facebook.com`,
                image: profile.photos ? profile.photos[0].value : '',
                gender: 'MALE',
                role: "USER",
                password: "12345678",
                facebookId: profile.id,
                isVerified: true,
            })
        }

        // Pass the user data to the next middleware
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

passport.serializeUser((user: any, done) => {
    done(null, user?._id.toString());
});
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});