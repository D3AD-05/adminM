const { pool, poolConnect } = require("../config/db");

const orderController = {
  getAllOrders: (req, res) => {
    console.log("get all orders");
    const sql = "SELECT * FROM orderMaster";
    pool.query(sql, (err, data) => {
      if (err) {
        console.error("Error retrieving data:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.status(200).json(data);
    });
  },
};
module.exports = orderController;
