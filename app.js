require("dotenv").config();
const express = require("express");
const app = express();
const path = require("node:path");
const passport = require("./config/passport");
const prisma = require("./lib/prisma");
const isAuth = require("./config/isAuth");

const session = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");

const PORT = process.env.PORT;
const connectionString = process.env.DATABASE_URL;

app.use(express.urlencoded({ extended: true }));
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const uploadRouter = require("./router/uploadRouter");
const signUpRouter = require("./router/signUpRouter");
const logInRouter = require("./router/logInRouter");
const folderRouter = require("./router/folderRouter");

const homeController = require("./controller/homeController");
const logOutController = require("./controller/logOutController");

const authErrorView = "authError";

// set up session store
const sessionStore = new PrismaSessionStore(prisma, {
  checkPeriod: 2 * 60 * 1000, //ms
  dbRecordIdIsSessionId: true,
  dbRecordIdFunction: undefined,
});

app.use(
  session({
    store: sessionStore,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // ms
      httpOnly: true,
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

// set up passport
app.use(passport.initialize());
app.use(passport.session());

// share user in all app
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// routers
app.get("/", homeController);
app.use("/upload", isAuth, uploadRouter);
app.use("/sign-up", signUpRouter);
app.use("/log-in", logInRouter);
app.get("/log-out", logOutController);
app.use("/folder", isAuth, folderRouter);

// error handle for custom error
app.use((err, req, res, next) => {
  return res
    .status(err.statusCode || 404)
    .render(authErrorView, { message: err.message, name: err.name });
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Express app is listening on localhost:${PORT}`);
});
