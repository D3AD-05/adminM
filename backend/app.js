// app.js
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const itemRoutes = require("./routes/itemRouter");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(express.json());

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));

app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.use("/items", itemRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
