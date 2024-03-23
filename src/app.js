const express = require('express');
// const OpenAI = require('openai');
const bolt = require('@slack/bolt');
const routes = require('./routes');
const setupSlackEvents = require('./slack/slackEvents');
const { port } = require('./config');
const decodeGoogleCredentials = require('./services/decodeGoogleCredentials.service');

decodeGoogleCredentials()


// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

const expressApp = express();

const receiver = new bolt.ExpressReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET || '',
    endpoints: '/slack/events',
    router: expressApp
});

const app = new bolt.App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_BOT_TOKEN,
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