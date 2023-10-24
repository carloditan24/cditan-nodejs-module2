/**
 * For remapping _doc object to convert _id to id attribute and carry-over remaining key-value pairs
 *
 * @param {object} item The _doc object from document instance
 * @returns Remapped object with id
 */
const remapItem = (item) => {
  const { _id, ...rest } = item;
  return {
    id: _id,
    ...rest,
  };
};

/**
 * For converting ISO timestamp to human readable format
 *
 * @param {string} timestamp ISO 8601 timestamp
 * @returns Date time format in YYYY/MM/DD HH:MM:SS(AM/PM) format
 */
const formatDateTime = (timestamp) => {
  const date = new Date(
    timestamp.toLocaleString("en-US", { timeZone: "Asia/Manila" })
  );

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours() % 12 || 12).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "PM" : "AM";

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}${ampm}`;
};

module.exports = { formatDateTime, remapItem };
