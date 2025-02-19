import express from "express";
import dotenv from "dotenv";
import dbInstance from "../../db/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

dotenv.config();

const loginRouter = express.Router();

loginRouter.post("/", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const query = `SELECT * FROM users WHERE username = '${username}'`;

  try {
    const rows = await dbInstance.query(query);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid username" });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    const encryptedRefreshToken = await bcrypt.hash(refreshToken, 10);

    const updateTokenQuery = `UPDATE refresh_tokens SET refresh_token = '${encryptedRefreshToken}' WHERE user_id = ${user.id}`;

    try {
      await dbInstance.query(updateTokenQuery);
    } catch (error) {
      console.error("Error saving refresh token to the database:", error);
      return res.status(500).send("Internal Server Error");
    }

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
      sameSite: "Strict",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "Strict",
    });

    return res.status(200).json({ id: user.id, username: user.username });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).send("Internal Server Error");
  }
});

export default loginRouter;
