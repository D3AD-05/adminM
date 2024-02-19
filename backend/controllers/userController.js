// controllers/userController.js
const { pool, poolConnect } = require("../config/db");

const UserController = {
  /*  -------------------  getAllUsers ----------------------------- */

  getAllUsers: (req, res) => {
    const sql = "SELECT * FROM userDetails";
    pool.query(sql, (err, data) => {
      if (err) {
        console.error("Error retrieving data:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.status(200).json(data);
    });
  },
  /*  -------------------  createUser ----------------------------- */

  createUser: (req, res) => {
    console.log(req.body.userType);
    const {
      userName,
      userPhoneNo,
      userEmail,
      userType,
      userStatus,
      userImage,
    } = req.body;
    const sql = `
    INSERT INTO userDetails (User_Name, User_PhoneNo, User_Type, User_Email, User_Status, User_Image)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
    pool.query(
      sql,
      [userName, userPhoneNo, userType, userEmail, userStatus, userImage],
      (err, data) => {
        if (err) {
          console.error("Error retrieving data:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        console.log(data.insertId);
        return res.status(200).json(data);
      }
    );
  },

  /*  -------------------  updateUser ----------------------------- */
  updateUser: (req, res) => {
    const { userId } = req.params;
    console.log(req.body);
    const {
      userName,
      userPhoneNo,
      userEmail,
      userType,
      userStatus,
      userImage,
    } = req.body;

    const columnMappings = {
      userName: "User_Name",
      userPhoneNo: "User_PhoneNo",
      userEmail: "User_Email",
      userType: "User_Type",
      userStatus: "User_Status",
      userImage: "User_Image",
    };

    const updateFields = Object.keys(req.body)
      .filter((key) => key !== "userId" && columnMappings[key])
      .map((key) => `${columnMappings[key]} = ?`)
      .join(", ");

    if (!updateFields) {
      return res.status(400).json({ error: "No valid update fields provided" });
    }

    const sql = `
    UPDATE userDetails
    SET ${updateFields}
    WHERE User_Id = ?
  `;

    const values = Object.keys(req.body)
      .filter((key) => key !== "userId") // Exclude userId from keys
      .map((key) => req.body[key]); // Map values based on keys

    values.push(userId); // Add userId to the end of the values array

    poolConnect
      .then(() => {
        pool.query(sql, values, (err, result) => {
          if (err) {
            console.error("Error executing query:", err);
            return res
              .status(500)
              .json({ error: "An error occurred while executing the query" });
          }
          res.status(200).json({ message: "User updated successfully" });
        });
      })
      .catch((err) => {
        console.error("Error connecting to MySQL:", err);
        res.status(500).json({
          error: "An error occurred while connecting to the database",
        });
      });
  },
  /*  -------------------  checkForApproval ----------------------------- */

  checkForApproval: (req, res) => {
    const { userId } = req.params;
    const sql = "SELECT User_Status FROM userDetails WHERE User_Id = ?";
    pool.query(sql, [userId], (err, data) => {
      if (err) {
        console.error("Error retrieving data:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (data.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      const userStatus = data[0].User_Status;
      return res.status(200).json({ userId, userStatus });
    });
  },

  /*  -------------------  checkPhoneNumber ----------------------------- */
  checkPhoneNumber: (req, res) => {
    const phoneNumber = req.body.phoneNumber;
    console.log("ssssssssssss", phoneNumber);
    const sql = `
    SELECT *  FROM userDetails WHERE User_PhoneNo = ${phoneNumber} AND User_Status = 2
  `;
    pool.query(sql, [phoneNumber], (err, data) => {
      console.log(sql, phoneNumber);
      if (err) {
        console.error("Error retrieving data:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      console.log(data);

      return res.status(200).json(data);
    });
  },
  /*  -------------------   ----------------------------- */

  cheqUniqeId: (req, res) => {
    const { primaryKey, filterArray } = req.body;

    const filterString = constructFilterString(filterArray);

    executeCheckUniqueId(tableName, primaryKey, filterString, (callback) => {
      res.send(callback);
    });
  },

  constructFilterString: (filterArray) => {
    let filterString = "1";
    for (const [key, element] of Object.entries(filterArray)) {
      filterString += ` AND ${key} = '${element.toString().trim()}'`;
    }
    return filterString;
  },

  executeCheckUniqueId: (tableName, primaryKey, filterString, callback) => {
    const sql = `SELECT ${primaryKey} FROM userDetails WHERE ${filterString}`;

    poolConnect
      .then(() => {
        pool.query(sql, (err, result) => {
          if (err) {
            console.error("Error executing query:", err);
            return callback(null); // Assuming null indicates failure
          }

          if (result && result.length > 0) {
            callback(true); // Indicates that the unique ID exists
          } else {
            callback(false); // Indicates that the unique ID doesn't exist
          }
        });
      })
      .catch((err) => {
        console.error("Error connecting to MySQL:", err);
        return callback(null); // Assuming null indicates failure
      });
  },
};

module.exports = UserController;
