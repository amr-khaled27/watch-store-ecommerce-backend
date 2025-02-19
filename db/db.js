import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    this.pool = mysql.createPool({
      connectionLimit: 10,
      host: process.env.HOST,
      user: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DBNAME,
    });
    Database.instance = this;
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  query(sql, values) {
    return new Promise((resolve, reject) => {
      this.pool.query(sql, values, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }

  async getUserById(userId) {
    const query = "SELECT * FROM users WHERE id = ?";
    const results = await this.query(query, [userId]);
    return results[0];
  }

  async clearCart(userId) {
    const query = "DELETE FROM cart WHERE user_id = ?";
    await this.query(query, [userId]);
  }
}

const dbInstance = Database.getInstance();

export default dbInstance;
