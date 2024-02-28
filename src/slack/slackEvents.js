const { calculateWeeksUntilSpecificOnCall, calculateDateRangeForNextOnCall } = require("../logic/onCallLogic");

  const setupSlackEvents = (app) => {
    app.command('/weeks-until', async ({ command, ack, respond, client }) => {
      await ack();
      const args = command.text.split(' ');
      const [firstName] = args;
    
      const userInfo = await client.users.info({ user: command.user_id });
      const userName = (userInfo.user?.real_name || userInfo.user?.name)?.split(' ')[0];
    
      const name = firstName || userName;
    
      if (name) {
        const nextOnCall = calculateWeeksUntilSpecificOnCall(name);
        const {start, end} = calculateDateRangeForNextOnCall(nextOnCall)

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
   
    app.command('/current', async ({ command, ack, respond, client }) => {
      await ack();
      
      const currentOnCall = getCurrentOnCall();
      res.send(currentOnCall);

      await respond(currentOnCall);
    });
   
    app.command('/next', async ({ command, ack, respond, client }) => {
      await ack();

      const args = command.text.split(' ');
      const [weekIndex] = args;
      
      const onCall = getOnCallPersonForNextXWeeks(weekIndex || 1);
      await respond(onCall);
    });

    app.command('/list', async ({ command, ack, respond, client }) => {
      const rotation = getFullOnCallRotation()
      const msg = rotation.map((person, i) => `${i + 1}. ${person}`).join('\n')

      await respond(msg);
    });

    app.command('/help', async ({ ack, respond }) => {
        await ack();

        const commands = [
            { name: '/weeks-until', description: 'Get the number of weeks until your next on-call and the date range.' },
            { name: '/current', description: 'Get the current on-call person.' },
            { name: '/next', description: 'Get the on-call person at the next X weeks.' },
            { name: '/list', description: 'Get the full on-call rotation' },
        ];

        const helpMessage = commands.map(cmd => `${cmd.name}: ${cmd.description}`).join('\n');

        await respond(`*Available commands:*\n${helpMessage}`);
    });
  
}

module.exports = setupSlackEvents