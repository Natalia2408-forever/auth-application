'use strict';
import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { authRouter } from './routes/auth.route.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';
import { ApiError } from './exeptions/api.error.js';
import { passport } from './config/passport.js';
import { client } from './utils/db.js';

if (!process.env.JWT_KEY || !process.env.JWT_REFRESH_KEY) {
  throw new Error('JWT_KEY and JWT_REFRESH_KEY must be set in .env');
}

const PORT = process.env.PORT || 3005;
const app = express();

app.set('trust proxy', 1);

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use(
  cors({
    origin: process.env.CLIENT_HOST,
    credentials: true,
  }),
);

app.use(authRouter);

app.get('/', (req, res) => {
  res.send('Hello');
});

app.use((req, res, next) => {
  next(ApiError.notFound('Page not found'));
});

app.use(errorMiddleware);

client
  .authenticate()
  .then(() => client.sync())
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });
