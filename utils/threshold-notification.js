const EventEmitter = require("events");
const logger = require("./../config/winston-config");
const { formatDateTime, remapItem } = require("./../utils");
const twilio = require("twilio");

class ThresholdNotificationService {
  constructor() {
    this.twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    this.thresholdEmitter = new EventEmitter();
    this.thresholds = {
      temperatureCelsius: parseFloat(process.env.TEMP_THRESHOLD),
      humidityPercent: parseFloat(process.env.HUMIDITY_THRESHOLD),
      pressureHpa: parseFloat(process.env.PRESSURE_THRESHOLD),
    };

    this.thresholdEmitter.on("trigger", (message) => {
      this.twilioClient.messages
        .create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: process.env.SAMPLE_RECIPIENT_MOBILE_NUMBER,
        })
        .then((message) => {
          console.log("Message sent with SID:", message.sid);
        });
    });
  }

  getEmitter() {
    return this.thresholdEmitter;
  }

  checkSensorDataIfBeyondThreshold(sensorData) {
    const { temperatureCelsius, humidityPercent, pressureHpa } =
      this.thresholds;
    let message = "";

    if (sensorData.temperatureCelsius > temperatureCelsius) {
      message += `Temperature above ${temperatureCelsius}°C.\n`;
    }
    if (sensorData.humidityPercent > humidityPercent) {
      message += `Humidity percentage above ${humidityPercent}%.\n`;
    }
    if (sensorData.pressureHpa > pressureHpa) {
      message += `Pressure above ${pressureHpa} hPa.\n`;
    }

    const sensorDataString = [
      `Time: ${formatDateTime(sensorData.timestamp)}`,
      `Location: ${sensorData.location}`,
      `Temp: ${sensorData.temperatureCelsius}`,
      `Humidity: ${sensorData.humidityPercent}%`,
      `Pressure: ${sensorData.pressureHpa} hPa`,
    ].join("\n");

    if (message) {
      this.thresholdEmitter.emit("trigger", `${message}\n${sensorDataString}`);
      return;
    }
  }
}

module.exports = ThresholdNotificationService;
