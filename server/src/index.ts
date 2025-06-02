/**
 * Node modules
 */
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';

/**
 * Import configs
 */
import { connectDB } from './config/connectDB';

/**
 * Import Middlewares
 */
import { errorHandler } from './middlewares/errorHandler';

/**
 * Import Routes
 */
import authRoute from './routes/authRoute';
import userRoute from './routes/userRoute';

/**
 * App
 */
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  }),
);
app.use(cookieParser());

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: 'Hello',
  });
});

/**
 * PORTS
 */
const PORT = process.env.PORT || 5000;
const BASE_PATH = process.env.BASE_PATH;

/**
 * Routes
 */
app.use(`${BASE_PATH}/auth`, authRoute);
app.use(`${BASE_PATH}/user`, userRoute);

/**
 * Error Handler
 */
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await connectDB();
});
