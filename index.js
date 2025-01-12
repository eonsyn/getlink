const express = require("express");
const axios = require("axios");
// const { scrapdata } = require("./scrappingLogic.js");
const Port = 2300;
const app = express();
// app.get("/", (req, res) => {
//   scrapdata(res);
// });
app.get("/home", (req, res) => {
  axios
    .get(
      "https://scrape.abstractapi.com/v1/?api_key=df74a5f42c584c7eb5d3b193d05ad1d1&url=https://hubcloud.ink/drive/juj0bb807xgashi"
    )
    .then((response) => {
      console.log(response.data);
      res.send(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
});
app.listen(Port, () => {
  console.log("server is running at 2300");
});
