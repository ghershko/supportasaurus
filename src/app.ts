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

const app = new bolt.App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_BOT_TOKEN,
});
  

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

app.message('hello', async ({ message, say }) => {
    console.log('recieved message', message)
    await say(`Hey there!`);
});

app.message('app_mention', async ({ message, say }) => {
    console.log('received mention', message)
    await say(`Hey there!`);
});

(async () => {
    // Start the app
    await app.start(process.env.PORT || 9000);
  
    console.log('⚡️ Bolt app is running!');
  })();
