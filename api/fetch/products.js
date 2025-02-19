import express from "express";
import dbInstance from "../../db/db.js";

const app = express();
const productsRouter = express.Router();

app.use(express.json());

productsRouter.get("/", async (req, res) => {
  try {
    const query = "SELECT * FROM products";
    const api_key = process.env.PRODUCTS_API_KEY;
    const authHeader = req.headers.authorization;

    if (!authHeader || authHeader.split(" ")[1] !== api_key) {
      return res.status(403).send("Forbidden: Invalid API key.");
    }

    const result = await new Promise((resolve, reject) => {
      dbInstance.query(query, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });

    res.json(result);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Internal Server Error");
  }
});

export default productsRouter;
