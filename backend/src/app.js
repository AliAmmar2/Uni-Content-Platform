require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();


connectDB();

app.use(express.json());
app.use("/api/auth", require("./routes/auth.routes"));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
