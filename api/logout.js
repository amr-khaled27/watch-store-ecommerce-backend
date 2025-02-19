import express from "express";

const logoutRouter = express.Router();

export const logoutHandler = (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 0,
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 0,
    });

    res.status(200).json({ loggedIn: false });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

logoutRouter.post("/", logoutHandler);

export default logoutRouter;
