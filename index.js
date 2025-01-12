const express = require("express");
const { scrapdata } = require("./scrappingLogic.js");
const Port = 2300;
const app = express();
app.get("/", (req, res) => {
  scrapdata(res);
});
app.listen(Port, () => {
  console.log("server is running at 2300");
});
