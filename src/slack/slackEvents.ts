import { App } from "@slack/bolt";

export const setupSlackEvents = (app: App) => {
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
}