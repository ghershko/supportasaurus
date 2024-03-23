const { 
  calculateWeeksUntilSpecificOnCall, 
  calculateDateRangeOfWeekNum, 
  getOnCallPersonForNextXWeeks, 
  getCurrentOnCall,
  formatOnCallListMsg,
  fetchSiftedCallRotation,
  fetchCallRotation,
  swichOnCallSifts,
} = require("../logic/onCallLogic");

const setupSlackEvents = (app) => {
  app.command('/weeks-until', async ({ command, ack, respond, client }) => {
    await ack();
    const args = command.text.split(' ');
    const [firstName] = args;
  
    const userInfo = await client.users.info({ user: command.user_id });
    const userName = (userInfo.user?.real_name || userInfo.user?.name)?.split(' ')[0];
  
    const name = firstName || userName;
  
    if (name) {
      const onCallRotation = await fetchSiftedCallRotation();

      const nextOnCall = calculateWeeksUntilSpecificOnCall(onCallRotation, name);
      const {start, end} = calculateDateRangeOfWeekNum(nextOnCall);

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
    
    app.command('/current', async ({ ack, respond }) => {
      await ack();
      const onCallRotation = await fetchSiftedCallRotation();
      const currentOnCall = await getCurrentOnCall(onCallRotation);

      await respond(currentOnCall);
    });
    
    app.command('/next', async ({ command, ack, respond }) => {
      await ack();

      const args = command.text.split(' ');
      const [weekIndex] = args;
      
      const onCallRotation = await fetchSiftedCallRotation();
      const onCall = getOnCallPersonForNextXWeeks(onCallRotation, weekIndex || 1);
      await respond(onCall);
    });
    
    app.command('/switch', async ({ command, ack, respond }) => {
      await ack();

      const args = command.text.split(' ');
      const [name1, name2] = args;
      
      try{
        const onCallRotation = await fetchCallRotation();
        const onCall = swichOnCallSifts(onCallRotation,name1, name2);
        await respond(onCall);
      }
      catch(err) {
        await respond(`Error: ${err.message}`);
      }
    });

    app.command('/list', async ({ respond }) => {
      const onCallRotation = await fetchSiftedCallRotation();
      const msg = formatOnCallListMsg(onCallRotation);
      const formattedMsg = `*On-Call Rotation:*\n\`\`\`\n${msg}\n\`\`\``;
      
      await respond(formattedMsg);
    });

    app.command('/help', async ({ ack, respond }) => {
      await ack();

      const commands = [
          { name: '/weeks-until', description: 'Get the number of weeks until your next on-call and the date range' },
          { name: '/current', description: 'Get the current on-call person' },
          { name: '/next', description: 'Get the on-call person at the next X weeks' },
          { name: '/list', description: 'Get the full on-call rotation' },
          { name: '/switch', description: 'Switch the on-call shifts between two specified team members' },
      ];

      const helpMessage = commands.map(cmd => `• \`${cmd.name}\`: ${cmd.description}`).join('\n');

      await respond({
          blocks: [ { type: 'section', text: {type: 'mrkdwn', text: `*Available commands:*\n${helpMessage}` }}],
          mrkdwn: true 
      });
  }); 
};

module.exports = setupSlackEvents;