// config/db.js
const mysql = require("mysql2");

const config = {
  host: "grambooserver-do-user-15832365-0.c.db.ondigitalocean.com",
  user: "doadmin",
  password: "AVNS_kboMWdqEK1MbaCuUO9_",
  database: "defaultdb",
  port: 8081,
};

const pool = mysql.createPool(config);

const poolConnect = new Promise((resolve, reject) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to MySQL:", err);
      reject(err);
    } else {
      console.log("Connected to MySQL!");
      resolve();
    }
  });
});
module.exports = { pool, poolConnect };
