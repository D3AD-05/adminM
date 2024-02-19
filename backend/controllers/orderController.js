const { pool, poolConnect } = require("../config/db");

const saveCustomer = (customerData) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO customers SET ?",
      customerData,
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.insertId); // Resolve with the inserted customer_id
        }
      }
    );
  });
};

// Function to save data to salesmen table
const saveSalesman = (salesmanData) => {
  return new Promise((resolve, reject) => {
    pool.query("INSERT INTO salesmen SET ?", salesmanData, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.insertId); // Resolve with the inserted salesman_id
      }
    });
  });
};

// Function to save data to order_Master table
const saveOrderMaster = (orderMasterData) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO order_Master SET ?",
      orderMasterData,
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.insertId); // Resolve with the inserted order_id
        }
      }
    );
  });
};

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
  // **************************************
  // Function to save data to all tables in a single function
  syncOrderData: async (customerData, salesmanData, orderMasterData) => {
    try {
      // Save customer data and get the inserted customer_id
      const customerId = await saveCustomer(customerData);

      // Save salesman data and get the inserted salesman_id
      const salesmanId = await saveSalesman(salesmanData);

      // Update orderMasterData with the retrieved customer_id and salesman_id
      orderMasterData.customer_Id = customerId;
      orderMasterData.salesman_id = salesmanId;

      // Save order master data and get the inserted order_id
      const orderId = await saveOrderMaster(orderMasterData);

      return { customerId, salesmanId, orderId }; // Return the inserted ids
    } catch (error) {
      throw error; // Throw any errors encountered
    }
  },

  // ////////////////////////////////////////
  getOrderDetails: (orderId) => {
    console.log("777");
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          om.order_id,
          om.order_date,
          om.order_deliveryDate,
          c.customer_id,
          c.customer_name,
          c.customer_addres,
          c.customer_phoneNo,
          s.salesman_id,
          s.salesman_name,
          s.salesman_phoneNo
        FROM 
          order_Master om
        JOIN 
          customers c ON om.customer_Id = c.customer_id
        JOIN 
          salesmen s ON om.salesman_id = s.salesman_id
        WHERE 
          om.order_id = 1
      `;
      pool.query(query, [1], (error, results) => {
        console.log(error, results, "ssS", query);
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log(results);
          resolve(results);
        }
      });
    });
  },
};
module.exports = orderController;
