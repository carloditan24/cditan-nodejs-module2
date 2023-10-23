const express = require("express");
const router = express.Router();
const { SensorData } = require("./../models/sensorData");
const {
  validatePaginationInput,
  validateSensorDataInput,
} = require("./../middleware/validations/sensorDataValidation");

/**
 * @swagger
 * /api/sensor:
 *   post:
 *     summary: Create a new sensor data entry.
 *     description: Creates a new sensor data entry with the provided parameters.
 *     tags:
 *       - Sensor Data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SensorDataRequest'
 *     responses:
 *       201:
 *         description: Sensor data created successfully.
 *       400:
 *         description: Validation error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrors'
 */
router.post("/", validateSensorDataInput, async (req, res, next) => {
  const data = req.body;

  const sensorData = new SensorData({
    timestamp: new Date(),
    location: data.location,
    temperatureCelsius: data.temperatureCelsius,
    humidityPercentage: data.humidityPercentage,
    pressureHpa: data.pressureHpa,
  });

  try {
    await sensorData.save();
    return res.status(201).json();
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/sensor:
 *   get:
 *     summary: Get sensor data with optional pagination.
 *     description: Retrieves sensor data sorted by timestamp desc with optional pagination using query parameters.
 *     tags:
 *       - Sensor Data
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page.
 *     responses:
 *       200:
 *         description: Sensor data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SensorData'
 *       400:
 *         description: Invalid pagination parameters.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrors'
 *             example:
 *               - path: ["page"]
 *                 message: "Page must be a valid number."
 *               - path: ["limit"]
 *                 message: "Limit must be a valid number."
 */
router.get("/", validatePaginationInput, async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const sensorData = await SensorData.find(
    {},
    "-_id timestamp location temperatureCelsius humidityPercentage pressureHpa"
  )
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json(sensorData);
});

/**
 * @swagger
 * components:
 *  schemas:
 *    SensorData:
 *      type: object
 *      properties:
 *        timestamp:
 *          type: string
 *          format: date-time
 *        location:
 *          type: string
 *        temperatureCelsius:
 *          type: number
 *          format: float
 *        humidityPercentage:
 *          type: number
 *          format: float
 *        pressureHpa:
 *          type: number
 *          format: float
 *      example:
 *        timestamp: "2023-10-24T12:00:00Z"
 *        location: "Living Room"
 *        temperatureCelsius: 22.5
 *        humidityPercentage: 45.0
 *        pressureHpa: 1013.2
 *    SensorDataRequest:
 *      type: object
 *      properties:
 *        location:
 *          type: string
 *        temperatureCelsius:
 *          type: number
 *          format: float
 *        humidityPercentage:
 *          type: number
 *          format: float
 *        pressureHpa:
 *          type: number
 *          format: float
 *      example:
 *        location: "Living Room"
 *        temperatureCelsius: 22.5
 *        humidityPercentage: 45.0
 *        pressureHpa: 1013.2
 *    ValidationErrors:
 *       type: array
 *       items:
 *         type: object
 *         properties:
 *           path:
 *             type: array
 *             items:
 *               type: string
 *           message:
 *             type: string
 *         example:
 *          - path: ["location"]
 *            message: "Location must not be empty."
 *          - path: ["temperatureCelsius"]
 *            message: "Temperature must be a number."
 */

module.exports = router;
