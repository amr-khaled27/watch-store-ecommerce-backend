import express from "express";
import dbInstance from "../../db/db.js";
import authMiddleware from "../../utils/authMiddleware.js";

const addToCartRouter = express.Router();

addToCartRouter.post("/", authMiddleware, async (req, res) => {
  const { productId } = req.body;
  const user = req.user;

  try {
    const checkQuery = `SELECT quantity FROM cart WHERE product_id = ${productId} AND user_id = ${user.id}`;
    const checkResult = await dbInstance.query(checkQuery);

    if (checkResult.length > 0) {
      const updateQuery = `UPDATE cart SET quantity = quantity + 1 WHERE product_id = ${productId} AND user_id = ${user.id}`;
      await dbInstance.query(updateQuery);
      res.status(200).json({ success: true });
    } else {
      const insertQuery = `INSERT INTO cart (product_id, user_id, quantity) VALUES (${productId}, ${user.id}, 1)`;
      await dbInstance.query(insertQuery);
      res.status(200).json({ success: true });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default addToCartRouter;
