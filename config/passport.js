const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const prisma = require("../lib/prisma");
const bcript = require("bcryptjs");

// notice: only find first matched user. If users have same name, so what is the case.
passport.use(
  new localStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findFirst({
        where: { name: username },
      });
      if (!user) {
        return done(null, false, { message: "Incorrect user name" });
      }
      const match = await bcript.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (e) {
      return done(e);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    done(null, user);
  } catch (e) {
    done(e);
  }
});

module.exports = passport;
