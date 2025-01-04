const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const UserInfo = require("./models/userinfo");
const predictionRouter = require("./routes/predict");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config(); // Load environment variables

const app = express();

// Google Generative AI Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generate = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error(err);
    return "Error: Unable to process the prompt.";
  }
};

// MongoDB Setup
const Mongo_Url = process.env.MONGO_URL;
if (!Mongo_Url) {
  console.error("MongoDB URL not defined in .env file.");
  process.exit(1);
}
mongoose
  .connect(Mongo_Url)
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.error("Database connection error:", err));

// View Engine Setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public"))); // Static files
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session Configuration
app.use(
  session({
    secret: "swasth_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 600000 }, // 10-minute session expiry
  })
);

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware for Authorization
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/signin");
}

// Gemini API Route
app.post("/gemini-search", async (req, res) => {
  const { prompt } = req.body;
  try {
    const result = await generate(prompt);
    res.json({ success: true, result });
  } catch (err) {
    res.json({
      success: false,
      error: "Failed to fetch response from Gemini API.",
    });
  }
});

// Routes for prediction
app.use("/predict", predictionRouter); // Prediction routes

// Landing Page
app.get("/", (req, res) => {
  res.render("ejs/index");
});

// Signup Page
app.get("/signup", (req, res) => {
  res.render("ejs/signup");
});

// Signup Route
app.post("/signup", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username });
    await User.register(user, password);
    req.login(user, (err) => {
      if (err) return next(err);
      res.redirect("/home");
    });
  } catch (error) {
    console.error(error);
    res.redirect("/signup");
  }
});

// Signin Page
app.get("/signin", (req, res) => {
  res.render("ejs/signin");
});

// Signin Route
app.post(
  "/signin",
  passport.authenticate("local", {
    failureRedirect: "/signin",
    failureMessage: true,
  }),
  (req, res) => {
    res.redirect("/home");
  }
);

// Home Page (Requires Authorization)
app.get("/home", isLoggedIn, (req, res) => {
  res.render("ejs/home", { user: req.user });
});

// Settings Page
app.get("/setting", isLoggedIn, (req, res) => {
  res.render("ejs/settings", { user: req.user });
});

// Gallery Page
app.get("/gallery", isLoggedIn, (req, res) => {
  res.render("ejs/gallery", { user: req.user });
});

// User Info Page
app.get("/userinfo", isLoggedIn, async (req, res) => {
  const userInfo = await UserInfo.findOne({ userId: req.user._id });
  res.render("ejs/userinfo", { userInfo, user: req.user });
});

// Save or Update User Info
app.post("/userinfo", isLoggedIn, async (req, res) => {
  const { name, sex, age, dob, weight, height, contact_info, address } =
    req.body;
  const userId = req.user._id;

  let userInfo = await UserInfo.findOne({ userId });
  if (userInfo) {
    Object.assign(userInfo, {
      name,
      sex,
      age,
      dob,
      weight,
      height,
      contact_info,
      address,
    });
    await userInfo.save();
  } else {
    userInfo = new UserInfo({
      userId,
      name,
      sex,
      age,
      dob,
      weight,
      height,
      contact_info,
      address,
    });
    await userInfo.save();
  }
  res.redirect("/userinfo");
});

// Logout Route
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
