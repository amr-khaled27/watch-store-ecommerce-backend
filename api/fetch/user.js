import express from "express";
import authMiddleware from "../../utils/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/", authMiddleware, async (req, res) => {
  const user = req.user;
  res.status(200).json({ loggedIn: true, user: user });
});

export default userRouter;
