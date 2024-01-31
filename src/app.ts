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

expressApp.use((req, _, next) => {
    console.log(`✨ Received request at ${req.path}`);
    next();
});
  
// -------------------------------------------------------------------------------------- //

// app.post('/ask-gpt', async (req: Request, res: Response) => {
//     try {
//         const { prompt } = req.body;
//         const gptResponse = await openai.chat.completions.create({
//             messages: [{ role: 'user', content: prompt }],
//             model: 'gpt-4-1106-preview',
//         });

//         res.json(gptResponse);
//     } catch (error: any) {
//         res.status(500).json({ error: error.message });
//     }
// });

// const PORT = process.env.PORT || 9000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

// -------------------------------------------------------------------------------------- //

app.message('hello', async ({ message, say }) => {
    console.log('recieved message', message)
    await say(`Hey there!`);
});

app.message('app_mention', async ({ message, say }) => {
    console.log('received mention', message)
    await say(`Hey there!`);
});

app.event('app_mention', async ({ event, say }) => {
    await say(`Hello <@${event.user}>!`);
});

app.error(async (error) => {
    console.error('Error in Slack Event Listener:', error);
});

app.command('/when-is-my-turn', async ({ command, ack, say }) => {
    await ack();

    const args = command.text.split(' ');

    await say(`You entered: ${args.join(', ')}`);
});


// -------------------------------------------------------------------------------------- //

expressApp.listen(process.env.PORT || 3000, () => {
    console.log(`⚡️ Bolt app is running on port ${process.env.PORT || 3000}!`);
});