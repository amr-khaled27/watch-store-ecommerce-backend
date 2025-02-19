import express from "express";
import productsRouter from "./api/fetch/products.js";
import signupRouter from "./api/auth/signup.js";
import loginRouter from "./api/auth/login.js";
import logoutRouter from "./api/logout.js";
import userRouter from "./api/fetch/user.js";
import addToCartRouter from "./api/cart/add-to-cart.js";
import fetchCartRouter from "./api/fetch/cart.js";
import removeFromCartRouter from "./api/cart/remove-from-cart.js";
import quantityRouter from "./api/cart/quantity.js";
import checkoutRouter from "./api/checkout.js";
import clearCartRouter from "./api/cart/clear-cart.js";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import rateLimiter from "./utils/rateLimiter.js";
import helmet from "helmet";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500);
});

app.use(
  "/images",
  express.static(path.join(__dirname, "images"), { maxAge: "1d" })
);

app.use("/api/fetch/user", userRouter);
app.use("/api/fetch/products", productsRouter);
app.use("/api/auth/signup", rateLimiter, signupRouter);
app.use("/api/auth/login", rateLimiter, loginRouter);
app.use("/api/logout", logoutRouter);
app.use("/api/add-to-cart", addToCartRouter);
app.use("/api/cart", fetchCartRouter);
app.use("/api/cart", removeFromCartRouter);
app.use("/api/cart", quantityRouter);
app.use("/api/cart", clearCartRouter);
app.use("/api/checkout", checkoutRouter);

app.listen(PORT, () => {
  console.log(`Live on port: ${PORT}`);
});
