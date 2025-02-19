import express from "express";
import dbInstance from "../../db/db.js";
import authMiddleware from "../../utils/authMiddleware.js";

const clearCartRouter = express.Router();

clearCartRouter.delete("/", authMiddleware, async (req, res) => {
  const id = req.user.id;

  try {
    await dbInstance.clearCart(id);
    res.status(200).send("Cart cleared");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

export default clearCartRouter;
