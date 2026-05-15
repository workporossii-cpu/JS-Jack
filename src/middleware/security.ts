import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from '../config';

const cspConfig = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "https://telegram.org"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'", "https://sj-server-1.onrender.com"],
  },
};

export const securityMiddleware = [
  helmet({ contentSecurityPolicy: cspConfig }),
  cors({ origin: config.corsOrigin, credentials: true }),
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: 'Too many requests, please try again later.',
  }),
];
