import express from "express";
import authMiddleware from "../../utils/authMiddleware.js";
import dbInstance from "../../db/db.js";

const fetchCartRouter = express.Router();

fetchCartRouter.get("/", authMiddleware, async (req, res) => {
  const user = req.user;

  try {
    const cartQuery =
      "SELECT id, user_id, product_id, quantity FROM cart WHERE user_id = ?";
    const cartItems = await dbInstance.query(cartQuery, [user.id]);

    if (cartItems.length === 0) {
      return res.status(200).send([]);
    }

    const productIds = cartItems.map((item) => item.product_id);
    const productsQuery = "SELECT * FROM products WHERE id IN (?)";
    const products = await dbInstance.query(productsQuery, [productIds]);

    const cartWithProductDetails = cartItems.map((cartItem) => {
      const product = products.find((p) => p.id === cartItem.product_id);
      return {
        ...cartItem,
        product,
      };
    });

    res.status(200).json(cartWithProductDetails);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

fetchCartRouter.get("/count", authMiddleware, async (req, res) => {
  const user = req.user;

  try {
    const cartQuery =
      "SELECT id, user_id, product_id, quantity FROM cart WHERE user_id = ?";
    const cartItems = await dbInstance.query(cartQuery, [user.id]);

    if (cartItems.length === 0) {
      return res.status(200).json({ count: 0 });
    }

    res.status(200).json({ count: cartItems.length });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default fetchCartRouter;
