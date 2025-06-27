const { authRouter } = require("./register");

const { Router } = require("express");
const { creatorRouter } = require("./course");
const { userRouter } = require("./user");
const router = Router();

router.use("/auth", authRouter);
router.use("/creator", creatorRouter);
router.use("/user", userRouter);

module.exports = {
  mainRouter: router,
};
