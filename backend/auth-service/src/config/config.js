const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi'); // Vẫn cần Joi để validate config

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    PORT: Joi.number().default(3001),
    MONGO_URI: Joi.string().required().description('Mongo DB connection string'),
    BETTER_AUTH_SECRET: Joi.string().required().description('Secret key for better-auth'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGO_URI,
  },
  betterAuth: {
    secret: envVars.BETTER_AUTH_SECRET,
  },
};