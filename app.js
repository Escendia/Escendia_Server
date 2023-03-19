require("dotenv").config({ path: "./src/config/config.env" });
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./src/config/db");
const errorHandler = require("./src/middleware/error");

connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/data", require("./src/routes/data"));

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
  console.log("Logged Error:", err.message);
  console.log("Logged Error:", promise);

  //server.close(() => process.exit(1));
});
