// app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const itemRoutes = require("./routes/itemRouter");
const app = express();
const PORT = process.env.PORT || 25060;

app.use(cors());
app.use(express.json());

app.use(bodyParser.json({ limit: "1024mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "1024mb", extended: true }));

app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.use("/items", itemRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
