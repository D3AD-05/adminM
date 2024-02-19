const { pool, poolConnect } = require("../config/db");

const itemController = {
  createItem: (req, res) => {
    const itemsToInsert = req.body.items;
    console.log("createItem ");

    console.log(itemsToInsert);
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
      console.log(prodId);
      // Check if the record with the same prodId already exists
      const selectSql = `
            SELECT prodId FROM itemMaster WHERE prodId = ?
          `;

      return new Promise((resolve, reject) => {
        pool.query(selectSql, [prodId], (selectErr, selectResult) => {
          if (selectErr) {
            console.error("Error retrieving data:", selectErr);
            reject({ error: "Internal Server Error" });
          }

          if (selectResult.length > 0) {
            console.log("already exsist");
            resolve(null);
          } else {
            console.log("in insert");
            const insertSql = `
                  INSERT INTO itemMaster
                  (prodId, prodCode, ItemCategoryName, itemName, DesignCode, Gwt, Stonewt, Diawt, NetWt, SuppName, synced, syncedDevice, createdBy, createdDate, modifiedBy, modifiedDate)
                  VALUES
                  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
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
                  reject({ error: "Internal Server Error" });
                }
                console.log(data.insertId);
                resolve(data);
              }
            );
          }
        });
      });
    });

    // Execute all the insert queries in parallel
    Promise.all(insertQueries)
      .then((results) => {
        // Filter out the null results (duplicate records)
        const validResults = results.filter((result) => result !== null);
        return res.status(200).json(validResults);
      })
      .catch((err) => {
        console.error("Error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      });
  },

  // ------------------------------
  getAllItems: (req, res) => {
    const sql = "SELECT * FROM itemMaster";
    pool.query(sql, (err, data) => {
      if (err) {
        console.error("Error retrieving data:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.status(200).json(data);
    });
  },
};

module.exports = itemController;
