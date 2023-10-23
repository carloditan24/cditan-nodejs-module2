const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "THP Sensor Data API",
    version: "1.0.0",
    description: "API documentation using Swagger",
  },
  servers: [
    {
      url: "http://localhost:3000",
    },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: ["./routes/*.js"], // Update with the path to your route files
};

module.exports = options;
