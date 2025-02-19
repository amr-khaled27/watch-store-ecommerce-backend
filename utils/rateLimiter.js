import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({
  windowMs: 3 * 60 * 1000,
  max: 200,
  message: "Too many requests from this IP, please try again after 15 minutes",
  headers: true,
});

export default rateLimiter;
