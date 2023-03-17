const express = require("express");
const http = require("http");
const path = require("path");
const Dalai = require("../../index");
const app = express();
const httpServer = http.Server(app);
const dalai = new Dalai();
const start = (port) => {
  dalai.http(httpServer);
  app.use(express.static(path.resolve(__dirname, "public")));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.set("view engine", "ejs");
  app.set("views", path.resolve(__dirname, "views"));
  app.get("/", (req, res) => {
    res.render("index");
  });
  app.get("/style.css", (req, res) => {
    res.sendFile(path.resolve(__dirname, "views", "style.css"));
  });
  app.get("/index.js", (req, res) => {
    res.sendFile(path.resolve(__dirname, "views", "index.js"));
  });
  httpServer.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
};
module.exports = start;
