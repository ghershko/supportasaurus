const express = require('express');
// const OpenAI = require('openai');
const boltServer = require('@slack/bolt');
const routes = require('./routes');
const setupSlackEvents = require('./slack/slackEvents');
const { port, slackSecret, bolt } = require('./config');
const decodeGoogleCredentials = require('./services/decodeGoogleCredentials.service');

decodeGoogleCredentials()


// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

const expressApp = express();

const receiver = new boltServer.ExpressReceiver({
    signingSecret:  slackSecret,
    endpoints: '/slack/events',
    router: expressApp
});

const app = new boltServer.App({
    signingSecret: bolt.signingSecret,
    token: bolt.token,
    receiver: receiver
});

expressApp.use(express.json());

expressApp.use('/', routes);

setupSlackEvents(app);

app.error(async (error) => {
    console.error('Error in Slack Event Listener:', error);
});

expressApp.listen(port, () => {
    console.log(`⚡️ Bolt app is running on port ${port}`);
});