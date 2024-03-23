const { config } = require('dotenv');

config();

module.exports = {
    port: process.env.PORT || 3001,
    credentialsBase64: process.env.GOOGLE_CREDENTIALS_BASE64,
    slackSecret: process.env.SLACK_SIGNING_SECRET || '',
    bolt: {
        signingSecret: process.env.SLACK_SIGNING_SECRET,
        token: process.env.SLACK_BOT_TOKEN
    },
    onCallSheet: {
        docId: '1AETwV9w-Nuf6mwM9fFgdRkqxem0D9jxSEVlb7YWpypY',
        range: 'Rotation 2024!A2:A'
    }
};
