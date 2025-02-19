import express from "express";
import dbInstance from "../../db/db.js";
import authMiddleware from "../../utils/authMiddleware.js";

const quantityRouter = express.Router();

quantityRouter.post("/increment", authMiddleware, async (req, res) => {
  const { productId } = req.body;

  const userId = req.user.id;

  const query = `
    SELECT p.stock, c.quantity 
    FROM products p
    LEFT JOIN cart c ON c.product_id = p.id AND c.user_id = ?
    WHERE p.id = ?;
  `;
  const values = [userId, productId];

  try {
    const data = await dbInstance.query(query, values);
    if (data.length === 0) {
      return res.status(404).send("Product not found");
    }

    const { stock, quantity: cartQuantity } = data[0];
    if (cartQuantity === null) {
      return res.status(404).send("Item not found in cart");
    }

    if (cartQuantity >= stock) {
      return res.status(400).send("Cannot increment beyond stock");
    }

    const updateQuery = `
      UPDATE cart 
      SET quantity = quantity + 1 
      WHERE user_id = ? AND product_id = ?;
    `;
    await dbInstance.query(updateQuery, values);

    return res.status(200).send("Quantity updated successfully");
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
});

quantityRouter.post("/decrement", authMiddleware, async (req, res) => {
  const { productId } = req.body;

  const userId = req.user.id;

  const getQuantityQuery =
    "SELECT quantity FROM cart WHERE user_id = ? AND product_id = ?";
  const values = [userId, productId];

  const data = await dbInstance.query(getQuantityQuery, values);
  if (data.length === 0) {
    return res.status(404).send("Item not found in cart");
  }

  const rows = data[0];

  const currentQuantity = rows.quantity;

  if (currentQuantity <= 1) {
    return res.status(400).send("Cannot decrement below 1");
  }

  const decrementQuery =
    "UPDATE cart SET quantity = quantity - 1 WHERE user_id = ? AND product_id = ?";
  await dbInstance.query(decrementQuery, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error decrementing item quantity");
    }
  });

  res
    .status(200)
    .send(`Item ${productId} quantity decremented for user ${userId}`);
});

export default quantityRouter;
