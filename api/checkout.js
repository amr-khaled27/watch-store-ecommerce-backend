import express from "express";
import stripePackage from "stripe";
import authMiddleware from "../utils/authMiddleware.js";
import dotenv from "dotenv";

dotenv.config();

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

const checkoutRouter = express.Router();

checkoutRouter.post("/", authMiddleware, async (req, res) => {
  const cartItems = req.body.cartItems;

  try {
    const shippingCost = 1599;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        ...cartItems.map((item) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Shipping",
            },
            unit_amount: shippingCost,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:8080/success",
      cancel_url: "http://localhost:8080/cancel",
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

export default checkoutRouter;
