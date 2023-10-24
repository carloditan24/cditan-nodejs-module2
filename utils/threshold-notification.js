const EventEmitter = require("events");

class ThresholdNotificationService {
  constructor() {
    this.thresholdEmitter = new EventEmitter();

    this.thresholdEmitter.on("trigger", (data) => {
      console.log("TRIGGER: Mock send notification.", data);
    });
  }

  getEmitter() {
    return this.thresholdEmitter;
  }
}

module.exports = ThresholdNotificationService;
