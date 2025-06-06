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
const rateLimit = require("express-rate-limit");
const flash = require("connect-flash");

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
    secret: process.env.SESSION_SECRET || "swasth_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 600000, // 10-minute session expiry
      secure: process.env.NODE_ENV === "production", // Set secure cookies in production
      httpOnly: true, // Prevent client-side access to cookies
    },
  })
);

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash Messages
app.use(flash());

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
  const errorMessage = req.flash("error") || ""; // Get flash error
  res.render("ejs/signup", { errorMessage });
});

// Signup Route
app.post("/signup", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username });
    await User.register(user, password);
    req.login(user, (err) => {
      if (err) return next(err);
      req.flash("success", "Successfully signed up!"); // Set success message
      res.redirect("/home");
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Error during signup. Please try again.");
    res.redirect("/signup");
  }
});

// Signin Page
app.get("/signin", (req, res) => {
  const errorMessage = req.flash("error") || ""; // Get flash error
  res.render("ejs/signin", { errorMessage });
});

// Signin Route
app.post(
  "/signin",
  passport.authenticate("local", {
    failureRedirect: "/signin",
    failureMessage: true,
  }),
  (req, res) => {
    req.flash("success", "Successfully logged in!"); // Set success message
    res.redirect("/home");
  }
);

//contact page
app.get("/contact", isLoggedIn, (req, res) => {
  res.render("ejs/contact", { user: req.user });
});

//contact page
app.get("/about", isLoggedIn, (req, res) => {
  res.render("ejs/about", { user: req.user });
});

// Route for the Terms & Conditions page
app.get("/terms", isLoggedIn, (req, res) => {
  res.render("ejs/terms", { user: req.user });
});

// Route for the Privacy Policy page
app.get("/privacy", isLoggedIn, (req, res) => {
  res.render("ejs/privacy", { user: req.user });
});

//home page
app.get("/home", isLoggedIn, async (req, res) => {
  try {
    const userInfo = await UserInfo.findOne({ userId: req.user._id });
    if (!userInfo) {
      req.flash(
        "error",
        "User information not found. Please update your profile."
      );
      return res.redirect("/userinfo");
    }
    res.render("ejs/home", { userInfo });
  } catch (err) {
    console.error(err);
    req.flash("error", "An error occurred while fetching user information.");
    res.redirect("/userinfo");
  }
});

// Settings Page
app.get("/setting", isLoggedIn, (req, res) => {
  res.render("ejs/settings", { user: req.user });
});

// Gallery Page
app.get("/gallery", isLoggedIn, (req, res) => {
  res.render("ejs/gallery");
});

// User Info Page
app.get("/userinfo", isLoggedIn, async (req, res) => {
  const userInfo = await UserInfo.findOne({ userId: req.user._id });
  const errorMessage = req.flash("error") || ""; // Fetch error message (if any)
  const successMessage = req.flash("success") || ""; // Fetch success message (if any)
  res.render("ejs/userinfo", {
    userInfo,
    user: req.user,
    errorMessage, // Pass error message
    successMessage, // Pass success message
  });
});

// Save or Update User Info
// Save or Update User Info
app.post("/userinfo", isLoggedIn, async (req, res) => {
  const { name, sex, age, dob, weight, height, contact_info, address } =
    req.body;
  const userId = req.user._id;

  // Manual Validation
  if (
    !name ||
    !sex ||
    !age ||
    !dob ||
    !weight ||
    !height ||
    !contact_info ||
    !address
  ) {
    req.flash("errorMessage", "All fields are required.");
    return res.redirect("/userinfo");
  }

  if (!["Male", "Female", "Transgender"].includes(sex)) {
    req.flash("errorMessage", "Invalid gender value.");
    return res.redirect("/userinfo");
  }

  if (isNaN(age) || age < 0 || age > 150) {
    req.flash("errorMessage", "Age must be a number between 0 and 150.");
    return res.redirect("/userinfo");
  }

  if (isNaN(weight) || weight < 1) {
    req.flash("errorMessage", "Weight must be a number greater than 0.");
    return res.redirect("/userinfo");
  }

  if (isNaN(height) || height < 30 || height > 300) {
    req.flash("errorMessage", "Height must be a number between 30 and 300.");
    return res.redirect("/userinfo");
  }

  if (!/^\d{10}$/.test(contact_info)) {
    req.flash("errorMessage", "Contact info must be a valid 10-digit number.");
    return res.redirect("/userinfo");
  }

  try {
    // Find user info by userId
    let userInfo = await UserInfo.findOne({ userId });

    if (userInfo) {
      // Update existing user info
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
      // Create new user info
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

    // Success message
    req.flash("successMessage", "User information saved successfully!");
    res.redirect("/userinfo");
  } catch (err) {
    console.error(err);
    req.flash(
      "errorMessage",
      "Unable to save user data. Please try again later."
    );
    res.redirect("/userinfo");
  }
});

//logout
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err); // Handle any error
    }
    res.render("ejs/logout"); // Render the logout page
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Rate Limiting for Signin and Signup routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

app.use("/signin", limiter);
app.use("/signup", limiter);

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
