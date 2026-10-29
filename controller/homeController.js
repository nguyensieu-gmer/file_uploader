const prisma = require("../lib/prisma");
const homeView = "home";

const getHome = [
  (req, res, next) => {
    if (!req.user) {
      res.render(homeView);
    } else {
      return next();
    }
  },
  async (req, res) => {
    const userId = req.user ? req.user.id : null;
    const userFolders = await prisma.folder.findMany({
      where: { userId },
    });
    res.render(homeView, { userFolders });
  },
];

module.exports = getHome;
