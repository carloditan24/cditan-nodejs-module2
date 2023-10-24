const z = require("zod");
const logger = require("../config/winston-config");

const checkThresholds = () => {
  try {
    const thresholdSchema = z.object({
      temperatureCelcius: z.number({
        invalid_type_error: "Temperature must be a number.",
      }),
      humidityPercent: z.number({
        invalid_type_error: "Humidity Percent must be a number.",
      }),
      pressureHpa: z.number({
        invalid_type_error: "Pressure hPa must be a number.",
      }),
    });

    const thresholdValues = {
      temperatureCelcius: parseFloat(process.env.TEMP_THRESHOLD),
      humidityPercent: parseFloat(process.env.HUMIDITY_THRESHOLD),
      pressureHpa: parseFloat(process.env.PRESSURE_THRESHOLD),
    };

    thresholdSchema.parse(thresholdValues);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

module.exports = checkThresholds;
