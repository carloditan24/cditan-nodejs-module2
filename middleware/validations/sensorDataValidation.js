const { sensorDataValidationSchema } = require("./../../models/sensorData");
const errorSchema = require("./errorSchema");
const z = require("zod");

const isValidNumber = (parsedValue, value) => {
  return (
    !isNaN(parsedValue) && parsedValue.toString() === value && parsedValue > 0
  );
};

const validatePaginationInput = (req, res, next) => {
  try {
    const paginationSchema = z.object({
      page: z.string().refine(
        (value) => {
          const parsedValue = parseInt(value);
          return isValidNumber(parsedValue, value);
        },
        {
          message: "Page must be a valid number.",
        }
      ),
      limit: z.string().refine(
        (value) => {
          const parsedValue = parseInt(value);
          return isValidNumber(parsedValue, value);
        },
        {
          message: "Limit must be a valid number.",
        }
      ),
    });
    paginationSchema.parse(req.query);
  } catch (err) {
    return res.status(400).json(errorSchema.parse(err.issues));
  }
};
const validateSensorDataInput = (req, res, next) => {
  try {
    sensorDataValidationSchema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json(errorSchema.parse(err.issues));
  }
};

module.exports = { validatePaginationInput, validateSensorDataInput };
