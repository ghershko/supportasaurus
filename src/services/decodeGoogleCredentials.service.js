const fs = require('fs');
const path = require('path');
const { credentialsBase64 } = require('../config');

// for production
const decodeGoogleCredentials = () => {
    if (credentialsBase64) {
      const credentialsBuffer = Buffer.from(credentialsBase64, 'base64');
      const credentialsJSON = credentialsBuffer.toString('utf-8');
      const filePath = path.join(__dirname, 'google-credentials.json');
      fs.writeFileSync(filePath, credentialsJSON);
      process.env.GOOGLE_APPLICATION_CREDENTIALS = filePath;
    }
}

module.exports = decodeGoogleCredentials
