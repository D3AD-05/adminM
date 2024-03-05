const getAllUsersMdl = () => {
  const sql = "SELECT * FROM userDetails ORDER BY User_Id DESC";
  return sql;
};

module.exports = { getAllUsersMdl };
