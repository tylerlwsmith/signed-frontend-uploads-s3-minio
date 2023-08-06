import express from "express";

const app = express();

app.get("*", (_req, res) => {
  res.send("Hello, world!");
});

app.listen(3000, "0.0.0.0", function () {
  console.log("Listening...");
});
