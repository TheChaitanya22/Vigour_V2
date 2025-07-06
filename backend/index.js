require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cors = require("cors");
const { mainRouter } = require("./routes/index");

const app = express();
const allowedOrigins = [
  "http://loalhost:5173",
  "https://vigour-chaitanya.vercel.app",
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/", mainRouter);

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} & Database connected`);
  });
}

main();
