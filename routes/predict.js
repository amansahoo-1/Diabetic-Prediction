const express = require("express");
const router = express.Router();
const axios = require("axios");

// Render prediction form
router.get("/", (req, res) => {
  res.render("pages/predictionForm");
});

// Handle prediction form submission
router.post("/", async (req, res) => {
  try {
    const {
      pregnancies,
      glucose,
      bloodPressure,
      skinThickness,
      insulin,
      bmi,
      diabetesFunction,
      age,
    } = req.body;

    // Combine individual inputs into an array
    const inputFeatures = [
      Number(pregnancies),
      Number(glucose),
      Number(bloodPressure),
      Number(skinThickness),
      Number(insulin),
      Number(bmi),
      Number(diabetesFunction),
      Number(age),
    ];

    console.log("Sending input features:", inputFeatures);

    // Send data to the Flask API
    const response = await axios.post(
      "http://127.0.0.1:5000/predict",
      { features: inputFeatures },
      { headers: { "Content-Type": "application/json" } }
    );

    // Extract prediction result
    const prediction = response.data.prediction;
    req.session.predictionResult = prediction;
    res.redirect("/predict/result");
  } catch (error) {
    console.error("Error during prediction:", error.message);
    res.status(500).send("Error occurred while predicting.");
  }
});

// Render prediction result
router.get("/result", (req, res) => {
  const outcome = req.session.predictionResult;
  console.log(outcome);
  if (outcome == undefined) {
    return res.send("No prediction found. Please try again.");
  }
  const result =
    outcome === 1
      ? "The person is having diabetes."
      : "The person is not having diabetes.";

  res.render("pages/predictionResult", { result });
});

module.exports = router;
