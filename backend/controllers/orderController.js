const { pool, poolConnect } = require("../config/db");

const saveCustomer = (customerData) => {
  const modifiedCustomers =
    customerData.length > 0
      ? customerData
          .filter((customer) => customer.isSynced !== 1)
          .map(({ customer_id, ...rest }) => ({
            ...rest,
            customer_mobReferenceNo: customer_id?.toString(),
          }))
      : [];
  // Check if any customer has isSynced property equal to 0
  const shouldInsert = modifiedCustomers.length > 0;

  if (!shouldInsert) {
    console.log("No customer with isSynced = 0 found. Skipping insertion.");
    return Promise.resolve(null);
  }

  const values = modifiedCustomers.map((customer) => [
    customer.customer_name,
    customer.customer_address,
    customer.customer_phoneNo,
    customer.customer_contactPerson,
    customer.customer_img,
    customer.customer_email,
    1, //sync
    customer.createdBy,
    customer.createdDate,
    customer.modifiedBy,
    customer.modifiedDate,
    customer.customer_mobReferenceNo,
  ]);

  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO customers (customer_name, customer_address, customer_phoneNo, customer_contactPerson, customer_img, customer_email, isSynced, createdBy, createdDate, modifiedBy, modifiedDate, customer_mobReferenceNo) VALUES ?",
      [values],
      (error, results) => {
        if (error) {
          console.error("Error saving customer data:", error);
          reject({ error: "Error saving customer data" });
        } else {
          console.log("customer synced");
          resolve({ customerSyncResponse: "customer synced" }); // Resolve with the inserted customer_id
        }
      }
    );
  });
};

const saveSalesman = (salesmanData) => {
  return new Promise((resolve, reject) => {
    const modifiedSalesmen =
      salesmanData.length > 0
        ? salesmanData
            .filter((salesman) => salesman.isSynced !== 1)
            .map(({ salesManId, ...rest }) => ({
              ...rest,
              salesman_mobReferenceNo: salesManId.toString(),
            }))
        : [];

    const shouldInsert = modifiedSalesmen.length > 0;

    if (!shouldInsert) {
      console.log("No salesman with isSynced = 0 found. Skipping insertion.");
      resolve(null);
      return;
    }

    const values = modifiedSalesmen.map((salesman) => [
      salesman.salesManName,
      salesman.contactNum,
      1, //  synced
      salesman.createdBy,
      salesman.createdDate,
      salesman.modifiedBy,
      salesman.modifiedDate,
      salesman.salesman_mobReferenceNo,
    ]);

    pool.query(
      "INSERT INTO salesmen (salesman_name, salesman_phoneNo, isSynced, createdBy, createdDate, modifiedBy, modifiedDate, salesman_mobReferenceNo) VALUES ?",
      [values],
      (error, results) => {
        if (error) {
          console.error("Error saving salesman data:", error);
          reject({ error: "Error saving salesman data" });
        } else {
          console.log("salesman synced");
          resolve({ salesmanSyncResponse: "salesman synced" });
        }
      }
    );
  });
};

const saveOrderDetails = (orderDetailData) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO order_details SET ?",
      orderDetailData,
      (error, results) => {
        if (error) {
          console.error("Error saving salesman data:", error);
          reject({ error: "Error saving salesman data" });
        } else {
          resolve(results.insertId); // Resolve with the inserted salesman_id
        }
      }
    );
  });
};

// const saveOrderDetails = (orderId, orderDetailsData) => {
//   return new Promise((resolve, reject) => {
//     const query = "INSERT INTO order_details (order_id, product_id, item_catagoryName,) VALUES ?";
//     const values = orderDetailsData.map(item => [orderId, item.productId, item.itemCategoryName,]);

//     pool.query(query, [values], (error, results) => {
//       if (error) {
//         console.error("Error saving order details:", error);
//         reject({ error: "Error saving order details" });
//       } else {
//         resolve(results);
//       }
//     });
//   });
// };

// Function to save data to order_Master table
const saveOrderMaster = (orderMasterData) => {
  return new Promise((resolve, reject) => {
    const modifiedOrders =
      orderMasterData.length > 0
        ? orderMasterData
            .filter((order) => order.isSynced !== 1)
            .map(
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
      order.createdBy,
      order.createdDate,
      order.modifiedBy,
      order.modifiedDate,
    ]);

    pool.query(
      "INSERT INTO order_Master (order_date, order_deliveryDate, salesman_id, customer_Id, order_totalItems, order_totalApxWt, order_remarks, order_selectPerson, order_mobReferenceNo, isSynced, createdBy, createdDate, modifiedBy, modifiedDate) VALUES ?",
      [values],
      (error, results) => {
        if (error) {
          console.error("Error saving order master:", error);
          reject({ error: "Error saving order master" });
        } else {
          console.log("order master synced");
          resolve({ orderMasterSyncResponse: "order master synced" });
        }
      }
    );
  });
};
const saveOrderItemSummary = (orderItemSummaryData) => {
  const modifiedOrderItemSummary =
    orderItemSummaryData.length > 0
      ? orderItemSummaryData
          .filter((item) => item.isSynced !== 1)
          .map(({ orderNo, ...rest }) => ({
            ...rest,
            order_mobReferenceNo: orderNo.toString(),
          }))
      : [];

  const shouldInsert = modifiedOrderItemSummary.length > 0;

  if (!shouldInsert) {
    console.log(
      "No order item summary with isSynced = 0 found. Skipping insertion."
    );
    return Promise.resolve(null);
  }

  const values = modifiedOrderItemSummary.map((item) => [
    item.order_id,
    item.item_id,
    item.item_catagory_name,
    item.item_remark,
    item.order_item_summarycol,
    item.total_qty,
    item.total_grossWeight,
    item.total_stoneWeight,
    item.total_diamondWeight,
    item.total_net_weight,
    item.total_apxWeight,
  ]);

  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO order_item_summary (order_id, item_id, item_catagory_name, item_remark, order_item_summarycol, total_qty, total_grossWeight, total_stoneWeight, total_diamondWeight, total_net_weight, total_apxWeight) VALUES ?",
      [values],
      (error, results) => {
        if (error) {
          console.error("Error saving order item summary data:", error);
          reject({ error: "Error saving order item summary data" });
        } else {
          console.log("Order item summary synced");
          resolve({
            orderItemSummarySyncResponse: "Order item summary synced",
          }); // Resolve with the inserted ois_id
        }
      }
    );
  });
};

// ----------------------------------------------------------------------------------------
const orderController = {
  getAllOrders: (req, res) => {
    console.log("get all orders    ");
    const sql = `SELECT om.*, DATE_FORMAT(order_date, '%Y-%m-%d') AS formatted_order_date 
    FROM order_Master om WHERE status < 4`;
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
  // **************************************
  // Function to save data to all tables in a single function
  syncOrderData: async (req, res) => {
    console.log("sync", req.body);
    const customerData = req.body?.customers;
    const salesmanData = req.body?.salesman;
    const orderMasterData = req.body?.orderMaster;

    try {
      const customerSyncResponse = await saveCustomer(customerData);
      const salesmanSyncResponse = await saveSalesman(salesmanData);
      const orderMasterSyncResponse = await saveOrderMaster(orderMasterData);
      const orderItemSummarySyncResponse = await saveOrderItemSummary(
        orderMasterData
      );

      // const salesmanId = await saveSalesman(salesmanData);

      // orderMasterData.customer_Id = customerId;
      // orderDetailData.customer_Id = customerId
      // orderMasterData.salesman_id = salesmanId;

      // const orderId = await saveOrderMaster(orderMasterData);
      console.log(
        "222222222",
        customerSyncResponse,
        salesmanSyncResponse,
        orderMasterSyncResponse,
        orderItemSummarySyncResponse
      );
      return res.status(200).json({
        status: 200,
        message: "Insertion successful",
        data: {
          customerSyncResponse,
          salesmanSyncResponse,
          orderMasterSyncResponse,
          orderItemSummarySyncResponse,
        },
      });
    } catch (error) {
      throw error;
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

  updateOrderMaster: (req, res) => {
    console.log(req.params, "updateOrderMaster", req.body);
    const { orderId } = req.params;
    const {
      order_id,
      order_date,
      order_deliveryDate,
      salesman_id,
      customer_Id,
      order_totalItems,
      order_totalApxWt,
      order_remarks,
      order_selectPerson,
      order_mobReferenceNo,
      isSynced,
      createdBy,
      createdDate,
      modifiedBy,
      modifiedDate,
      status,
      deviceName,
    } = req.body;

    const sql = `
      UPDATE \`defaultdb\`.\`order_Master\`
      SET
      \`order_id\` = ${order_id},
      \`order_date\` = '${order_date}',
      \`order_deliveryDate\` = '${order_deliveryDate}',
      \`salesman_id\` = '${salesman_id}',
      \`customer_Id\` = '${customer_Id}',
      \`order_totalItems\` = '${order_totalItems}',
      \`order_totalApxWt\` = '${order_totalApxWt}',
      \`order_remarks\` = '${order_remarks}',
      \`order_selectPerson\` = '${order_selectPerson}',
      \`order_mobReferenceNo\` = '${order_mobReferenceNo}',
      \`isSynced\` = ${isSynced},
      \`createdBy\` = '${createdBy}',
      \`createdDate\` = '${createdDate}',
      \`modifiedBy\` = '${modifiedBy}',
      \`modifiedDate\` = '${modifiedDate}',
      \`status\` = ${status},
      \`deviceName\` = '${deviceName}'
      WHERE \`order_id\` = ${orderId};
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
          console.log(res.status);
        });
      })
      .catch((err) => {
        console.error("Error connecting to MySQL:", err);
        res.status(500).json({
          error: "An error occurred while connecting to the database",
        });
      });
  },
};
module.exports = orderController;
