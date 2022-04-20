const colors = require("colors");
const path = require("path");
const http = require("http");
const express = require("express");
const { notFound, errorHandler } = require("./middleware/error");
const connectDB = require("./db");
const { join } = require("path");
const session = require("express-session");
const logger = require("morgan");

// Passport
const passport = require("passport");
require("./utils/passportConfig");

// Routes
const authRouter = require("./routes/auth");
const eventRouter = require("./routes/event");
const settingRouter = require("./routes/setting");
const paymentRouter = require("./routes/payment");
const profileRouter = require("./routes/profile");
const scheduleRouter = require("./routes/schedule");

const { json, urlencoded } = express;

connectDB();
const app = express();
const server = http.createServer(app);

if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
}

// Middleware
app.use(json({ limit: '50mb' }));
app.use(urlencoded({ limit: '5mb', extended: true }));
app.use(express.static(join(__dirname, "public")));

// Sessions
app.use(
  session({
    secret: `${process.env.EXPRESS_SESSION_SECRET}`,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use("/setting", settingRouter);
app.use("/payment", paymentRouter);
app.use("/event", eventRouter);
app.use("/profile", profileRouter);
app.use("/schedule", scheduleRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname), "client", "build", "index.html")
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running");
  });
}

app.use(notFound);
app.use(errorHandler);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = { app, server };