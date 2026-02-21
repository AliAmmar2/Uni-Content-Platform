const express = require("express");
const app = express();

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.listen(3000, "127.0.0.1", () => {
  console.log("Test server running on http://127.0.0.1:3000");
});