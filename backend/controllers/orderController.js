const { pool, poolConnect } = require("../config/db");

// ---------  sync functions ------------------>

const saveCustomer = (customerData) => {
  return new Promise((resolve, reject) => {
    try {
      const modifiedCustomers =
        customerData.length > 0
          ? customerData.map(({ customer_id, ...rest }) => ({
              ...rest,
              customer_mobReferenceNo: customer_id?.toString(),
            }))
          : [];

      const values = modifiedCustomers.map((customer) => [
        customer.customer_name,
        customer.customer_address,
        customer.customer_phoneNo,
        customer.customer_contactPerson,
        customer.firebase_imgUrl,
        customer.customer_email,
        customer.createdBy,
        customer.createdDate,
        customer.modifiedBy,
        customer.modifiedDate,
        customer.customer_mobReferenceNo,
        customer.deviceName,
      ]);

      const existingCustomersToDelete = modifiedCustomers.map((customer) => [
        customer.deviceName,
        customer.customer_mobReferenceNo,
      ]);

      const deleteQuery = `DELETE FROM customers WHERE (deviceName, customer_mobReferenceNo) IN (?)`;
      pool.query(
        deleteQuery,
        [existingCustomersToDelete],
        (deleteError, deleteResults) => {
          if (deleteError) {
            console.error("Error deleting existing customers:", deleteError);
            reject({ error: "Error deleting existing customers" });
            return;
          }

          console.log(
            "Existing customers deleted:",
            deleteResults.affectedRows
          );

          pool.query(
            "INSERT INTO customers (customer_name, customer_address, customer_phoneNo, customer_contactPerson, firebase_imgUrl, customer_email, createdBy, createdDate, modifiedBy, modifiedDate, customer_mobReferenceNo, deviceName) VALUES ?",
            [values],
            (error, results) => {
              if (error) {
                console.error("Error saving customer data:", error);
                reject({ error: "Error saving customer data" });
              } else {
                console.log("Customer data synced---->", results);
                resolve({ customerSyncResponse: "Customer data synced" });
              }
            }
          );
        }
      );
    } catch (error) {
      console.error("An error occurred:", error);
      reject({ error: "An error occurred" });
    }
  });
};

const saveSalesman = (salesmanData) => {
  return new Promise((resolve, reject) => {
    try {
      const modifiedSalesmen =
        salesmanData.length > 0
          ? salesmanData.map(({ salesManId, ...rest }) => ({
              ...rest,
              salesman_mobReferenceNo: salesManId.toString(),
            }))
          : [];

      const values = modifiedSalesmen.map((salesman) => [
        salesman.salesManName,
        salesman.contactNum,
        salesman.createdBy,
        salesman.createdDate,
        salesman.modifiedBy,
        salesman.modifiedDate,
        salesman.salesman_mobReferenceNo,
        salesman.deviceName,
      ]);

      const existingSalesmenToDelete = modifiedSalesmen.map((salesman) => [
        salesman.deviceName,
        salesman.salesman_mobReferenceNo,
      ]);
      if (existingSalesmenToDelete.length === 0) {
        console.log("No salesmen to delete. Skipping deletion.");

        resolve(null);
        return;
      }

      const deleteQuery = `DELETE FROM salesmen WHERE (deviceName, salesman_mobReferenceNo) IN (?)`;
      pool.query(
        deleteQuery,
        [existingSalesmenToDelete],
        (deleteError, deleteResults) => {
          console.log(deleteQuery, existingSalesmenToDelete);
          if (deleteError) {
            console.error("Error deleting existing salesmen:", deleteError);
            reject({ error: "Error deleting existing salesmen" });
            return;
          }

          console.log("Existing salesmen deleted:", deleteResults.affectedRows);

          pool.query(
            "INSERT INTO salesmen (salesman_name, salesman_phoneNo, createdBy, createdDate, modifiedBy, modifiedDate, salesman_mobReferenceNo, deviceName) VALUES ?",
            [values],
            (error, results) => {
              if (error) {
                console.error("Error saving salesman data:", error);
                reject({ error: "Error saving salesman data" });
              } else {
                console.log("Salesman data synced");
                resolve({ salesmanSyncResponse: "Salesman data synced" });
              }
            }
          );
        }
      );
    } catch (error) {
      console.error("An error occurred:", error);
      reject({ error: "An error occurred" });
    }
  });
};

const saveOrderDetails = (modifiedOrderItemSummary) => {
  return new Promise((resolve, reject) => {
    try {
      const values = modifiedOrderItemSummary.map((item) => [
        item.orderNo,
        item.prodId,
        item.ItemCategoryName,
        item.itemId,
        item.designCId,
        item.Gwt,
        item.Stonewt,
        item.Diawt,
        item.NetWt,
        item.qty,
        item.appxWt,
        item.size,
        item.remark,
        item.createdBy,
        item.createdDate,
        item.modifiedBy,
        item.modifiedDate,
        item.deviceName,
      ]);

      const existingOrderDetailsToDelete = modifiedOrderItemSummary.map(
        (item) => [item.orderNo, item.deviceName]
      );
      if (existingOrderDetailsToDelete.length === 0) {
        console.log("No order details to delete. Skipping deletion.");
        resolve(null);
        return;
      }

      const deleteQuery = `DELETE FROM order_details WHERE (orderNo, deviceName) IN (?)`;
      pool.query(
        deleteQuery,
        [existingOrderDetailsToDelete],
        (deleteError, deleteResults) => {
          if (deleteError) {
            console.error(
              "Error deleting existing order item summary data:",
              deleteError
            );
            reject({
              error: "Error deleting existing order item summary data",
            });
            return;
          }

          console.log(
            "Existing order item summary data deleted:",
            deleteResults.affectedRows
          );

          pool.query(
            `INSERT INTO order_details (orderNo,
            prodId,
            ItemCategoryName,
            itemId,
            designCId,
            Gwt,
            Stonewt,
            Diawt,
            NetWt,
            qty,
            appxWt,
            size,
            remark,
            createdBy,
            createdDate,
            modifiedBy,
            modifiedDate,
            deviceName) VALUES ?`,
            [values],
            (error, results) => {
              if (error) {
                console.error("Error saving order item summary data:", error);
                reject({ error: "Error saving order item summary data" });
              } else {
                console.log("Order item summary data synced");
                resolve({
                  orderItemDetails: "Order item synced",
                });
              }
            }
          );
        }
      );
    } catch (error) {
      console.error("An error occurred:", error);
      reject({ error: "An error occurred" });
    }
  });
};

const saveOrderMaster = (orderMasterData) => {
  return new Promise((resolve, reject) => {
    try {
      const modifiedOrders =
        orderMasterData.length > 0
          ? orderMasterData.map(
              ({
                orderNo,
                totalItems,
                orderDate,
                salesManId,
                customerId,
                totalAppxWt,
                remark,
                deliveryDate,
                selectPerson,
                createdBy,
                createdDate,
                modifiedBy,
                modifiedDate,
                deviceName,
              }) => ({
                order_date: orderDate,
                order_deliveryDate: deliveryDate,
                salesman_id: salesManId,
                customer_Id: customerId,
                order_totalItems: totalItems,
                order_totalApxWt: totalAppxWt,
                order_remarks: remark,
                order_selectPerson: selectPerson,
                order_mobReferenceNo: orderNo,
                deviceName: deviceName,
                isSynced: 1, // Assuming 1 indicates synced
                createdBy,
                createdDate,
                modifiedBy,
                modifiedDate,
              })
            )
          : [];

      const shouldInsert = modifiedOrders.length > 0;

      if (!shouldInsert) {
        console.log("No orders with isSynced = 0 found. Skipping insertion.");
        resolve(null);
        return;
      }

      const existingOrdersToDelete = orderMasterData
        .filter((order) => order.orderNo !== 0)
        .map((order) => [order.deviceName, order.orderNo]);

      const deleteQuery = `DELETE FROM order_Master WHERE (deviceName, order_mobReferenceNo) IN (?)`;
      pool.query(
        deleteQuery,
        [existingOrdersToDelete],
        (deleteError, deleteResults) => {
          console.log(
            deleteQuery,
            existingOrdersToDelete,
            "777777777777777777"
          );
          if (deleteError) {
            console.error("Error deleting existing orders:", deleteError);
            reject({ error: "Error deleting existing orders" });
            return;
          }

          console.log("Existing orders deleted:", deleteResults.affectedRows);

          const values = modifiedOrders.map((order) => [
            order.order_date,
            order.order_deliveryDate,
            order.salesman_id,
            order.customer_Id,
            order.order_totalItems,
            order.order_totalApxWt,
            order.order_remarks,
            order.order_selectPerson,
            order.order_mobReferenceNo,
            order.isSynced,
            order.deviceName,
            order.createdBy,
            order.createdDate,
            order.modifiedBy,
            order.modifiedDate,
          ]);

          // Insert new modified orders
          const insertQuery = `INSERT INTO order_Master (order_date, order_deliveryDate, salesman_id, customer_Id, order_totalItems, order_totalApxWt, order_remarks, order_selectPerson, order_mobReferenceNo, isSynced, deviceName, createdBy, createdDate, modifiedBy, modifiedDate) VALUES ?`;
          pool.query(insertQuery, [values], (insertError, insertResults) => {
            if (insertError) {
              console.error("Error saving order master:", insertError);
              reject({ error: "Error saving order master" });
            } else {
              console.log("Order master synced");
              resolve({ orderMasterSyncResponse: "Order master synced" });
            }
          });
        }
      );
    } catch (error) {
      console.error("An error occurred:", error);
      reject({ error: "An error occurred" });
    }
  });
};

// ---------  sync functions end  ------------------>

//                   - - -

/*                 orderController                   */
const orderController = {
  // ---------    getAllOrders  ------------------>

  getAllOrders: (req, res) => {
    console.log("get all orders    ");
    const sql = `SELECT 
    om.order_id,
    om.order_date,
    om.order_deliveryDate,
    om.salesman_id,
    om.customer_Id,
    om.order_totalItems,
    om.order_totalApxWt,
    om.order_remarks,
    om.order_selectPerson,
    om.order_mobReferenceNo,
    om.status,
    DATE_FORMAT(om.order_date, '%Y-%m-%d') AS formatted_order_date ,
    c.customer_name,
    c.customer_address,
    c.customer_phoneNo,
    c.customer_contactPerson,
    c.firebase_imgUrl,
    c.customer_email
  FROM 
    order_Master om
     JOIN 
    customers c ON c.deviceName = om.deviceName AND c.customer_name = om.customer_Id
    WHERE om.status < 4`;
    // LEFT JOIN salesmen s ON om.salesman_id = s.salesman_id
    // LEFT JOIN customers c ON om.customer_Id = c.customer_id;;
    pool.query(sql, (err, data) => {
      if (err) {
        console.error("Error retrieving data:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.status(200).json(data);
    });
  },

  // ---------    getOrderDetails  ------------------> NOT USED
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
    c.customer_address,
    c.customer_phoneNo,
    c.customer_contactPerson,
    c.firebase_imgUrl,
    c.customer_email,
    c.customer_mobReferenceNo,
    c.status
FROM 
    order_Master om
JOIN 
    customers c ON c.deviceName = om.deviceName 
WHERE 
    om.status < 4;

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

  // ---------    updateOrderMaster change order status  ------------------>
  updateOrderMaster: (req, res) => {
    const { orderId } = req.params;
    console.log("UPDATE orderId CHANGE STATUS", orderId);
    const { status } = req.body;
    const sql = `
       UPDATE order_Master
      SET
       status = ${status}
      WHERE order_id = ${orderId};
    `;

    poolConnect
      .then(() => {
        console.log("000000", sql);
        pool.query(sql, (err, result) => {
          if (err) {
            console.error("Error executing query:", err);
            return res
              .status(500)
              .json({ error: "An error occurred while executing the query" });
          }
          res.status(200).json({ message: "Order updated successfully" });
          console.log("---------------->", result);
        });
      })
      .catch((err) => {
        console.error("Error connecting to MySQL:", err);
        res.status(500).json({
          error: "An error occurred while connecting to the database",
        });
      });
  },

  // ---------    Sync with phone data  ------------------>
  syncOrderData: async (req, res) => {
    console.log("sync");
    const customerData = req.body?.customers;
    const salesmanData = req.body?.salesman;
    const orderMasterData = req.body?.orderMaster;
    const orderDetailsData = req.body?.orderDetails;

    try {
      const customerSyncResponse = await saveCustomer(customerData);
      const salesmanSyncResponse = await saveSalesman(salesmanData);
      const orderMasterSyncResponse = await saveOrderMaster(orderMasterData);
      try {
        const orderDetailsSyncResponse = await saveOrderDetails(
          orderDetailsData
        );
      } catch (error) {
        console.log("errrorrr error", error);
        throw error;
      }
      console.log(
        "respnse >>>",
        customerSyncResponse,
        salesmanSyncResponse,
        orderMasterSyncResponse,
        orderDetailsSyncResponse
        // orderItemSummarySyncResponse
      );
      return res.status(200).json({
        status: 200,
        message: "Insertion successful",
        data: {
          customerSyncResponse,
          salesmanSyncResponse,
          orderMasterSyncResponse,
          // orderItemSummarySyncResponse,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  // ---------    send approved data to win   ------------------>
  getApprovedOrderDetails: (req, res) => {
    console.log("get all orders");
    const sql = `
       SELECT 
    om.order_id,
    om.order_date,
    om.order_deliveryDate,
    om.salesman_id,
    om.customer_Id,
    om.order_totalItems,
    om.order_totalApxWt,
    om.order_remarks,
    om.order_selectPerson,
    om.order_mobReferenceNo,
    om.status,
    om.deviceName,
    DATE_FORMAT(om.order_date, '%Y-%m-%d') AS formatted_order_date ,
    od.orderNo,
    od.prodId,
    od.itemId,
    od.designCId,
    od.qty,
    od.Gwt,
    od.remark,
    od.Stonewt,
    od.Diawt,
    od.NetWt,
    od.size,
    od.ItemCategoryName
  FROM 
    order_Master om
    LEFT JOIN order_details od ON od.deviceName = om.deviceName AND om.order_mobReferenceNo = od.orderNo
    WHERE om.status = 2 AND windowsSynced !=1 `;
    pool.query(sql, (err, data) => {
      if (err) {
        console.error("Error retrieving data:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.status(200).json(data);
    });
  },

  // ---------    sync status from win   ------------------>
  updateOrderSycStatusWin: (req, res) => {
    console.log(req.params, "--------------------");
    const { orderId, deviceName, isSynced } = req.params;

    const sql = `
    UPDATE order_Master
    SET
    windowsSynced = 1
    WHERE
    order_id =?
    AND
    deviceName = ?
  `;

    poolConnect
      .then(() => {
        pool.query(sql, [isSynced, orderId, deviceName], (err, result) => {
          if (err) {
            console.error("Error executing query:", err);
            return res
              .status(500)
              .json({ error: "An error occurred while executing the query" });
          }
          res.status(200).json({ message: "User status synced successfully" });
        });
      })
      .catch((err) => {
        console.error("Error connecting to MySQL:", err);
        res.status(500).json({
          error: "An error occurred while connecting to the database",
        });
      });
  },

  // ---------    get design code details   ------------------>
  getDesignCodeDetails: (req, res) => {
    console.log("getDesignCodeDetails");
  },
};
module.exports = orderController;
