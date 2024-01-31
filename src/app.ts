import express, { Request, Response } from 'express';
import { config } from 'dotenv';
import OpenAI from 'openai';
import bolt from '@slack/bolt';


config();

// const app = express();
// app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

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

// -------------------------------------------------------------------------------------- //

expressApp.get('/isAlive', (req, res) => {
    res.send('Server is alive');
});

expressApp.use(express.json());

expressApp.use((req, _, next) => {
    console.log(`✨ Received request at ${req.path}`);
    next();
});

// -------------------------------------------------------------------------------------- //


app.event('app_mention', async ({ event, say }) => {
    await say(`Hello <@${event.user}>!`);
});

app.command('/when-is-my-turn', async ({ command, ack, say, client }) => {
    await ack();
    const userInfo = await client.users.info({ user: command.user_id });


    const args = command.text.split(' ');
    const userName = userInfo.user?.real_name || userInfo.user?.name;


    await say(`Hi ${userName}. You entered: ${args.join(', ')}`);
});

app.error(async (error) => {
    console.error('Error in Slack Event Listener:', error);
});

// -------------------------------------------------------------------------------------- //

expressApp.listen(process.env.PORT || 3000, () => {
    console.log(`⚡️ Bolt app is running on port ${process.env.PORT || 3000}!`);
});