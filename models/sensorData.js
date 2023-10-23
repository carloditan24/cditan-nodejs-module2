const mongoose = require("mongoose");
const z = require("zod");

const sensorDataValidationSchema = z
  .object({
    location: z
      .string({
        invalid_type_error: "Location must be a string.",
        required: "Location is required.",
      })
      .trim()
      .min(1, { message: "Location must not be empty." }),
    temperatureCelsius: z.number({
      invalid_type_error: "Temperature must be a number.",
      required: "Temperature celsius is required.",
    }),
    humidityPercentage: z.number({
      invalid_type_error: "Humidity percentage must be a number.",
      required: "Humidity percentage celsius is required.",
    }),
    pressureHpa: z.number({
      invalid_type_error: "Pressure HPA must be a number.",
      required: "Pressure HPA is required.",
    }),
  })
  .strict();

const sensorDataSchema = new mongoose.Schema({
  timestamp: Date,
  location: String,
  temperatureCelsius: Number,
  humidityPercent: Number,
  pressureHpa: Number,
});

const SensorData = mongoose.model("SensorData", sensorDataSchema);
module.exports = { sensorDataValidationSchema, SensorData };
