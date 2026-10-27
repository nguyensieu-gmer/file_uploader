require("dotenv").config();
const express = require("express");
const app = express();
const path = require("node:path");
const passport = require("./config/passport");
const prisma = require("./lib/prisma");

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
app.get("/", (req, res) => {
  res.render("home");
});
app.use("/upload", uploadRouter);
app.use("/sign-up", signUpRouter);

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Express app is listening on localhost:${PORT}`);
});
