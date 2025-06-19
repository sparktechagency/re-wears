import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import config from ".";
import { User } from "../app/modules/user/user.model";

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: config.google.clientID as string,
    clientSecret: config.google.clientSecret as string,
    callbackURL: config.google.callbackURL as string,
}, async (accessToken, refreshToken, profile, done) => {
    try {

        console.log(profile)
        done(null, profile);
    } catch (error) {
        done(error, undefined);
    }
}));

// Serialize & Deserialize User
passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        // const user = await User.findById(id);
        done(null, id as any);
    } catch (error) {
        done(error, null);
    }
});

export default passport;