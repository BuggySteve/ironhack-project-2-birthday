const express = require("express");
const hbs = require("hbs");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
// const nodemailer = require("nodemailer");

require("dotenv").config();

app.use(
  session({
    secret: process.env.Cookie_Secret,
    cookie: { maxAge: 60000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    })
  })
);

app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

hbs.registerPartials(__dirname + "/views/partials");


mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

app.use("/", identifyUser, require("./routes/index"));
app.use("/", identifyUser, require("./routes/user/user"));
app.use("/", identifyUser, authenticateUser, require("./routes/user/user-protected"));
app.use("/", identifyUser, authenticateUser, require("./routes/parties/parties"));

function identifyUser(req, res, next) {
  res.locals.currentUser = req.session.currentUser;
  next();
}

function authenticateUser(req, res, next) {
  if (req.session.currentUser) next();
  else res.redirect("/");
}

app.listen(process.env.PORT, () => {
  console.log(".get and thou shalt receive");
});
