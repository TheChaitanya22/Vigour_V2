const { authRouter } = require("./auth");

const { Router } = require("express");
const { courseRouter } = require("./course");
const router = Router();

router.use("/auth", authRouter);
router.use("/creator", courseRouter);

module.exports = {
  mainRouter: router,
};
