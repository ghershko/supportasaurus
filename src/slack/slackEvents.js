import { countWeeksUntilNextOnCall } from "../logic/onCallLogic";
export const setupSlackEvents = (app) => {
    app.event('app_mention', async ({ event, say }) => {
        await say(`Hello <@${event.user}>!`);
    });
    app.command('/when-is-my-turn', async ({ command, ack, say, client }) => {
        await ack();
        const args = command.text.split(' ');
        const [firstName] = args;
        const userInfo = await client.users.info({ user: command.user_id });
        const userName = (userInfo.user?.real_name || userInfo.user?.name)?.split(' ')[0];
        const name = firstName || userName;
        if (name) {
            const nextOnCall = countWeeksUntilNextOnCall(name);
            await say(`☎️ Your next on call shit is in ${nextOnCall} weeks`);
        }
        else {
            await say(`I can't find your name, please enter it as a parameter as such: /when-is-my-turn <NAME>`);
        }
    });
};
