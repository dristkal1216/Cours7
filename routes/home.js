const express = require("express");
let router = express.Router();
const fs = require("fs");
const path = require("path");

router.get(["/", "/index"], (req, res, next) => {
  fs.readFile(
    path.join(__dirname, "../views/home/index.html"),
    "utf-8",
    (err, indexHtml) => {
      if (err) return next(err);
      res.send(indexHtml);
    }
  );
});

module.exports = router;
