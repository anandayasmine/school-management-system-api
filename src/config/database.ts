import dotenv from "dotenv";
import mysql from "mysql2";

dotenv.config();

const connection = mysql.createPool({
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

connection.getConnection((err, conn) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL!");
    conn.release();
  }
});

export default connection;
