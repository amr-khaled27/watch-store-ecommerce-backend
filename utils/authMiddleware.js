import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const authMiddleware = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    req.user = {
      id: decoded.id,
      username: decoded.username,
    };

    req.authenticated = true;

    return next();
  } catch (error) {
    if (!refreshToken) {
      return res.status(401).send("Unauthorized");
    }

    try {
      const decodedRefresh = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const newAccessToken = jwt.sign(
        { id: decodedRefresh.id, username: decodedRefresh.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
        sameSite: "Strict",
      });
      req.user = {
        id: decodedRefresh.id,
        username: decodedRefresh.username,
      };
      req.authenticated = true;
      return next();
    } catch (refreshError) {
      return res.status(401).send("Unauthorized");
    }
  }
};

export default authMiddleware;
