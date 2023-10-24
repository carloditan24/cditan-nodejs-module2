require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const app = express();
const connectDB = require("./config/db");
const handleError = require("./middleware/errorMiddleware");
const loggerMiddleware = require("./middleware/loggerMiddleware");
const sensorRoutes = require("./routes/sensorRoutes");
const swaggerDef = require("./config//swagger-config");
const initializeTwilioClient = require("./config/twilio");
const checkThresholds = require("./config/thresholds");

connectDB();
initializeTwilioClient();
checkThresholds();

app.use(express.json());

app.use("/api/sensor", sensorRoutes);

const swaggerSpec = swaggerJsDoc(swaggerDef);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res, next) => {
  res.status(404).json({ message: "Not found." });
});

app.use(loggerMiddleware);

app.use(handleError);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
