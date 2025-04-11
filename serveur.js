const express = require("express");
const app = express();
const port = 3000;
var path = require("path");


const homeRouter = require("./routes/home");
const aproposRouter = require("./routes/apropos");
const itemRouter = require("./routes/item");
const contactRouter = require("./routes/contact");
const characterRouter = require("./routes/character");

app.use(express.static(path.join(__dirname, "public")));
app.use(["/","/home", "/home/index"], homeRouter);
app.use(["/item", "/item/index"], itemRouter);
app.use(["/contact", "/contact/index"], contactRouter);
app.use(["/character", "/character/index"], characterRouter);
app.use(["/apropos", "/apropos/index"], aproposRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
