const { countWeeksUntilNextOnCall, getDateRangeForNextOnCall } = require("../logic/onCallLogic");

  const setupSlackEvents = (app) => {
      // app.event('app_mention', async ({ event, say }) => {
      //     await say(`Hello <@${event.user}>!`);
      // });

    app.command('/when-is-my-turn', async ({ command, ack, respond, client }) => {
      await ack();
      const args = command.text.split(' ');
      const [firstName] = args;
    
      const userInfo = await client.users.info({ user: command.user_id });
      const userName = (userInfo.user?.real_name || userInfo.user?.name)?.split(' ')[0];
    
      const name = firstName || userName;
    
      if (name) {
        const nextOnCall = countWeeksUntilNextOnCall(name);
        const {start, end} = getDateRangeForNextOnCall(nextOnCall)

        if (nextOnCall) {
          await respond({
            blocks: [
               {
                 type: 'section',
                 text: {
                   type: 'mrkdwn',
                   text: `📆 Just a friendly countdown: ${nextOnCall} weeks until your on-call adventure begins!`
                 }
               },
               {
                 type: 'section',
                 text: {
                   type: 'mrkdwn',
                   text: `Starts at: ${start}`
                 }
               },
               {
                 type: 'section',
                 text: {
                   type: 'mrkdwn',
                   text: `Ends at: ${end}`
                 }
               }
            ]
           });
           
        } else {
          await respond("🌟 It's your turn to shine! You're on call this week. Good luck!");
        }
      } else {
        await respond(`I can't find your name, please enter it as a parameter as such: /when-is-my-turn <NAME>`);
      }
    });
      
}

module.exports = setupSlackEvents