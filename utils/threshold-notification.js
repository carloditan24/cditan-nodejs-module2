const EventEmitter = require("events");
const logger = require("./../config/winston-config");
const { formatDateTime, remapItem } = require("./../utils");

class ThresholdNotificationService {
  constructor(twilioClient, thresholds) {
    this.twilioClient = twilioClient;
    this.thresholdEmitter = new EventEmitter();
    this.thresholds = thresholds;

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
