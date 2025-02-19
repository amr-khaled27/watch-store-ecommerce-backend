import express from "express";
import dbInstance from "../../db/db.js";
import authMiddleware from "../../utils/authMiddleware.js";

const removeFromCartRouter = express.Router();

removeFromCartRouter.delete("/:itemId", authMiddleware, async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user.id;

  const query = "DELETE FROM cart WHERE user_id = ? AND product_id = ?";
  const values = [userId, itemId];

  await dbInstance.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error removing item from cart");
    }
  });
  res.status(200).send(`Item ${itemId} removed from user ${userId}'s cart`);
});

export default removeFromCartRouter;
