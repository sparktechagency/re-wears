import express, { Request, Response } from "express";
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import { Morgan } from "./shared/morgan";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import session from "express-session";
import passport from "./config/passport";
import router from "./app/routes";
const app = express();

// morgan
app.use(Morgan.successHandler);
app.use(Morgan.errorHandler);

//body parser
app.use(
  cors({
    origin: ["https://re-wears.com", "https://admin.re-wears.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//file retrieve
app.use(express.static("uploads"));

// Session middleware (must be before passport initialization)
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Secure should be true in production with HTTPS
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

//router
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send(`
    <div style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
      <h1 style="color: #333; margin-bottom: 20px;">Re-wears server is running!</h1>
      <p style="font-size: 18px; color: #666;">Beep! Beep!</p>
<p style="font-size: 16px; color: #666;">Welcome to the Re-wears server!</p>
<p style="font-size: 16px; color: #666;">We're excited to have you here. Feel free to explore and make the most of our services.</p>
<p style="font-size: 16px; color: #666;">If you have any questions or need assistance, don't hesitate to reach out to our support team.</p>
<p style="font-size: 16px; color: #666;">Happy exploring!</p>
<p style="font-size: 16px; color: #666;">Best regards,</p>
<p style="font-size: 16px; color: #666;">The Re-wears Team</p>
<p style="font-size: 16px; color: #666;">P.S. If you're interested in our services, please visit our website at <a href="https://re-wears.com" style="color: #007bff; text-decoration: none;">https://re-wears.com</a>.</p>
<p style="font-size: 16px; color: #666;">Thank you for choosing Re-wears!</p>

    </div>
  `);
});

//global error handler
app.use(globalErrorHandler);

// handle not found route
app.use((req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API DOESN'T EXIST",
      },
    ],
  });
});

export default app;
