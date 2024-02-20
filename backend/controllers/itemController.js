const { pool, poolConnect } = require("../config/db");

const itemController = {
  createItem: (req, res) => {
    try {
      const itemsToInsert = req.body.items;
      if (
        !itemsToInsert ||
        !Array.isArray(itemsToInsert) ||
        itemsToInsert.length === 0
      ) {
        throw new Error("No valid items provided");
      }

      const insertQueries = itemsToInsert.map((item) => {
        const {
          prodId,
          prodCode,
          ItemCategoryName,
          itemName,
          DesignCode,
          Gwt,
          Stonewt,
          Diawt,
          NetWt,
          SuppName,
          synced,
          syncedDevice,
          createdBy,
          createdDate,
          modifiedBy,
          modifiedDate,
        } = item;

        const selectSql = `SELECT prodId FROM itemMaster WHERE prodId = ?`;

        return new Promise((resolve, reject) => {
          pool.query(selectSql, [prodId], (selectErr, selectResult) => {
            if (selectErr) {
              console.error("Error retrieving data:", selectErr);
              reject({ error: "Error retrieving data:" });
              return;
            }

            if (selectResult.length > 0) {
              console.log("already exist");
              resolve(null);
            } else {
              const insertSql = `
                INSERT INTO itemMaster
                (prodId, prodCode, ItemCategoryName, itemName, DesignCode, Gwt, Stonewt, Diawt, NetWt, SuppName, synced, syncedDevice, createdBy, createdDate, modifiedBy, modifiedDate)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
              `;
              pool.query(
                insertSql,
                [
                  prodId,
                  prodCode,
                  ItemCategoryName,
                  itemName,
                  DesignCode,
                  Gwt,
                  Stonewt,
                  Diawt,
                  NetWt,
                  SuppName,
                  synced,
                  syncedDevice,
                  createdBy,
                  createdDate,
                  modifiedBy,
                  modifiedDate,
                ],
                (insertErr, data) => {
                  if (insertErr) {
                    console.error("Error inserting data:", insertErr);
                    reject({ error: "Error inserting data:" });
                    return;
                  }
                  console.log(data.insertId);
                  resolve({
                    message: `Item inserted with prodId: ${prodId}`,
                    data,
                  });
                }
              );
            }
          });
        });
      });

      Promise.all(insertQueries)
        .then((results) => {
          const validResults = results.filter((result) => result !== null);
          return res.status(200).json(validResults);
        })
        .catch((err) => {
          console.error("Error:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        });
    } catch (error) {
      console.error("Error:", error.message);
      return res.status(400).json({ error: error.message });
    }
  },

  getAllItems: (req, res) => {
    console.log("______");
    try {
      const sql = "SELECT * FROM itemMaster";
      pool.query(sql, (err, data) => {
        if (err) {
          console.error("Error retrieving data:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        console.log(data);
        return res.status(200).json(data);
      });
    } catch (error) {
      console.error("Error:", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = itemController;
