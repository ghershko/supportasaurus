const { config } = require('dotenv');

config();

module.exports = {
    port: process.env.PORT || 3001,
    credentialsBase64: process.env.GOOGLE_CREDENTIALS_BASE64
};
