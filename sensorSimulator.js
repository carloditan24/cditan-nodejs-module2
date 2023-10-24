const cron = require("node-cron");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const ThresholdNotificationService = require("./utils/threshold-notification");
const initializeTwilioClient = require("./config/twilio");

// Load environment variables
dotenv.config();

// Connect to your MongoDB database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// If you haven't already defined your SensorData model in your main application, define it here as well
const SensorData = mongoose.model(
  "SensorData",
  new mongoose.Schema({
    timestamp: Date,
    location: String,
    temperatureCelsius: Number,
    humidityPercent: Number,
    pressureHpa: Number,
  })
);

// Function to generate random sensor data
function generateSensorData() {
  const data = new SensorData({
    timestamp: new Date(), // current time
    location: `Location${Math.floor(Math.random() * 3) + 1}`, // random location
    temperatureCelsius: Math.random() * 15 + 20, // random temperature between 20 and 35
    humidityPercent: Math.floor(Math.random() * 100), // random humidity
    pressureHpa: Math.floor(Math.random() * 50) + 970, // random pressure between 970 and 1020
  });
  return data;
}

// Scheduled task for sensor data simulation
// This cron job is set to run every minute. You can adjust the timing as needed.
const notifService = new ThresholdNotificationService();

cron.schedule("* * * * *", async function () {
  console.log("Generating simulated sensor data...");

  // Create new sensor data
  const newSensorData = generateSensorData();

  // Save this data to your database
  try {
    const data = await newSensorData.save();
    console.log("Simulated data inserted:", data);
    notifService.checkSensorDataIfBeyondThreshold(data);
  } catch (err) {
    console.error("Error inserting simulated data:", err);
  }
});

// Keep the script running
setInterval(() => {}, 1000);
