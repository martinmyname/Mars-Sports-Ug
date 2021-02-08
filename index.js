//import dependencies
const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");
const MarsSportsUg = require("./routes/index.js");
// const login = require("./routes/loginRoutes.js");
const User = require("./models/user");
const csrf = require("csurf");
const csrfProtection = csrf();
const passport = require("passport");
const flash = require("connect-flash");
// const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

require("dotenv").config();
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const session = require("express-session");

//create express app
const app = express();

//set pug as the veiw engine for the app
app.set("view engine", "pug");
app.set("views", "./views");

//middleware
app.use(express.static("public"));
app.use(express.static("uploads"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 },
  })
);
app.use(flash());

/*  PASSPORT SETUP  */
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  next();
});

//all routes on the users' root "/users"
app.use("/user", userRoutes);
// app.use("/user", User);
// app.use(csrfProtection);
//all routes on the home root"/"
app.use("/", MarsSportsUg);

//connect database
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
require("./passport");
mongoose.connection
  .on("open", () => {
    console.log("Mongoose connection open");
  })
  .on("error", (err) => {
    console.log(`Connection error: ${err.message}`);
  });

//logout
app.post("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        // failed to destroy session
      } else {
        return res.redirect("/login");
      }
    });
  }
});

//Error page incase of accessing a wrong route
app.get("*", (req, res) => {
  res.status(404).render("errorpage.pug");
});

//app runs on port http://localhost:3000
app.listen(3000, () => {
  console.log("Listening on port:http://localhost:3000");
});
