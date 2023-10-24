const twilio = require("twilio");
const logger = require("./winston-config");

const initializeTwilioClient = async () => {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (
      !process.env.TWILIO_PHONE_NUMBER &&
      !process.env.SAMPLE_RECIPIENT_MOBILE_NUMBER
    ) {
      throw new Error("Twilio phone numbers not provided.");
    }
    const twilioClient = twilio(accountSid, authToken);

    await twilioClient.api.v2010.accounts(accountSid).fetch();
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

module.exports = initializeTwilioClient;
