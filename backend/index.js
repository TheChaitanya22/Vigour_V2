require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cors = require("cors");
const { mainRouter } = require("./routes/index");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", mainRouter);

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(process.env.PORT || 3000);
  console.log(`Server Started on port 3000; Database connected`);
}

main();
