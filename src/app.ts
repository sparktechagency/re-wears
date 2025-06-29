import express, { Request, Response } from "express";
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import { Morgan } from "./shared/morgan";
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import session from "express-session";
import passport from "./config/passport";
import router from "./app/routes";
const app = express();

// morgan
app.use(Morgan.successHandler);
app.use(Morgan.errorHandler);


//body parser
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//file retrieve
app.use(express.static('uploads'));

// Session middleware (must be before passport initialization)
app.use(session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Secure should be true in production with HTTPS
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

//router
app.use('/api/v1', router);

app.get("/", (req: Request, res: Response) => {
    res.send(
        `<h1 style="text-align: center; margin: 50px 0;">Re-wears server is running. Beep! Beep!</h1>`
    );
})

//global error handle
app.use(globalErrorHandler);

// handle not found route
app.use((req: Request, res: Response) => {
    res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Not Found",
        errorMessages: [
            {
                path: req.originalUrl,
                message: "API DOESN'T EXIST"
            }
        ]
    })
});

export default app;