const express = require("express");
const router = express.Router();
const { SensorData } = require("./../models/sensorData");
const {
  validatePaginationInput,
  validateSensorDataInput,
} = require("./../middleware/validations/sensorDataValidation");

const { remapItem } = require("./../utils");
const ThresholdNotificationService = require("../utils/threshold-notification");
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
    humidityPercent: data.humidityPercent,
    pressureHpa: data.pressureHpa,
  });

  try {
    const savedData = await sensorData.save();

    const notifService = new ThresholdNotificationService();
    notifService.checkSensorDataIfBeyondThreshold(savedData);
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
    "timestamp location temperatureCelsius humidityPercent pressureHpa"
  )
    .lean()
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json(sensorData.map((item) => remapItem(item)));
});

/**
 * @swagger
 * /api/sensor/{id}:
 *   get:
 *     summary: Get sensor data by ID.
 *     description: Retrieves sensor data by ID.
 *     tags:
 *       - Sensor Data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the sensor data to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sensor data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SensorData'
 *       404:
 *         description: Sensor data not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: 'Sensor data not found.'
 */
router.get("/:id", async (req, res, next) => {
  const id = req.params.id;

  const item = await SensorData.findById(
    id,
    "timestamp location temperatureCelsius humidityPercent pressureHpa"
  ).lean();

  if (!item) {
    return res.status(404).json({ message: "Sensor data not found." });
  }

  res.status(200).json(remapItem(item));
});

/**
 * @swagger
 * /api/sensor/{id}:
 *   put:
 *     summary: Update sensor data by ID.
 *     description: Updates sensor data by ID.
 *     tags:
 *       - Sensor Data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the sensor data to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SensorDataRequest'
 *     responses:
 *       204:
 *         description: Sensor data updated successfully.
 *       400:
 *         description: Validation error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrors'
 *       404:
 *         description: Sensor data not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
router.put("/:id", validateSensorDataInput, async (req, res, next) => {
  const id = req.params.id;

  const updatedItem = await SensorData.updateOne({ _id: id }, req.body);

  if (updatedItem.matchedCount) {
    res.status(204).json();
  } else {
    res.status(404).json({ message: "Sensor data not found." });
  }
});

/**
 * @swagger
 * /api/sensor/{id}:
 *   delete:
 *     summary: Delete sensor data by ID.
 *     description: Deletes sensor data by ID.
 *     tags:
 *       - Sensor Data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the sensor data to delete.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Sensor data deleted successfully.
 *       404:
 *         description: Sensor data not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;

  const deletedItem = await SensorData.deleteOne({ _id: id });

  if (deletedItem.deletedCount) {
    res.status(204).json();
  } else {
    res.status(404).json({ message: "Sensor data not found." });
  }
});

/**
 * @swagger
 * components:
 *  schemas:
 *    ErrorMessage:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *      example:
 *        message: "Sensor data not found."
 *    SensorData:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        timestamp:
 *          type: string
 *          format: date-time
 *        location:
 *          type: string
 *        temperatureCelsius:
 *          type: number
 *          format: float
 *        humidityPercent:
 *          type: number
 *          format: float
 *        pressureHpa:
 *          type: number
 *          format: float
 *      example:
 *        id: "6536ee0116f300dd3b5f743b"
 *        timestamp: "2023-10-24T12:00:00Z"
 *        location: "Living Room"
 *        temperatureCelsius: 22.5
 *        humidityPercent: 45.0
 *        pressureHpa: 1013.2
 *    SensorDataRequest:
 *      type: object
 *      properties:
 *        location:
 *          type: string
 *        temperatureCelsius:
 *          type: number
 *          format: float
 *        humidityPercent:
 *          type: number
 *          format: float
 *        pressureHpa:
 *          type: number
 *          format: float
 *      example:
 *        location: "Living Room"
 *        temperatureCelsius: 22.5
 *        humidityPercent: 45.0
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
