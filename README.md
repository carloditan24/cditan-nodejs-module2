# THP Sensor API

A simulation THP (Temperature, Humidity, Pressure) Sensor API for notifying via email if there are specific thresholds have been exceeded.

## Prerequisites

- Node `v18.15.0`
- MongoDB

## Setup and Installation

1. Install the required dependencies.

    ```bash
    npm install
    ```

2. Create a `.env` file based on the `.env.example` provided. Your `.env` file should look similar to the following:

    ```env
    MONGODB_URI=mongodb://localhost:27017/your-local-database
    NODE_ENV=local
    PORT=3000
    TWILIO_ACCOUNT_SID=<your account SID>
    TWILIO_AUTH_TOKEN=<your auth token>
    TWILIO_PHONE_NUMBER=<your twilio phone number as sender>
    SAMPLE_RECIPIENT_MOBILE_NUMBER=<recipient for notifications>
    ```

    Note that your MongoDB database must be created first before you can proceed, and also have your Twilio account set up.

3. Start the server:

    ```bash
    npm start
    ```

    The server will start on port [3000](http://localhost:3000) by default.

4. Navigate to the API docs via [OpenAPI](http://localhost:3000/docs) generated by swagger-jsdoc and swagger-ui-express.

## Running simulated data

From your codebase directory in your terminal, run the following

```bash
node sensorData.js
```

This will insert random sensor data to the databbase every minute and if the data contains info that goes beyond threshold on any of the three indicators, it will send an SMS notification.

---
