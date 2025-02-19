import express from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import dbInstance from "../../db/db.js";
import jwt from "jsonwebtoken";

const signupRouter = express.Router();

signupRouter.post("/", async (req, res) => {
  const { username, password } = req.body;

  const schema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  });

  const validation = schema.safeParse({ username, password });

  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.errors });
  }

  try {
    const query = "SELECT * FROM users WHERE username = ?";
    const values = [username];

    const rows = await dbInstance.query(query, values);

    if (rows.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = "INSERT INTO users (username, password) VALUES (?, ?)";
    const insertValues = [username, hashedPassword];

    const result = await dbInstance.query(insertQuery, insertValues);

    const insertedUserId = result.insertId;

    if (!insertedUserId) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    const accessToken = jwt.sign(
      { id: insertedUserId, username: username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: insertedUserId, username: username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    const encryptedRefreshToken = await bcrypt.hash(refreshToken, 10);

    const refreshQuery =
      "INSERT INTO refresh_tokens (refresh_token, user_id) VALUES (?, ?)";
    const refreshValues = [encryptedRefreshToken, insertedUserId];

    await dbInstance.query(refreshQuery, refreshValues);

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

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default signupRouter;
