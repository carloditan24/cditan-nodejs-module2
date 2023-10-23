const z = require("zod");

const errorSchema = z.array(
  z.object({
    path: z.array(z.string()),
    message: z.string(),
  })
);

module.exports = errorSchema;
