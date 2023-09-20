const path = require('path');
const getAllFiles = require('../utils/getAllFiles');

module.exports = (client) => {
  const eventFolders = getAllFiles(path.join(__dirname, '..', 'events'), true);

  for (const eventFolder of eventFolders) {
    const eventFiles = getAllFiles(eventFolder);
    eventFiles.sort((a, b) => a > b);

    const eventName = eventFolder.replace(/\\/g, '/').split('/').pop();

    client.on(eventName, async (arg) => {
      for (const eventFile of eventFiles) {
        const eventFunction = require(eventFile);
        await eventFunction(client, arg);
      }
    });
  }

  // Listen for the guildMemberAdd event
  client.on('guildMemberAdd', (member) => {
    const welcomeEventFile = path.join(__dirname, '..', 'events', 'guildMemberAdd', 'welcome.js');
    const welcomeFunction = require(welcomeEventFile);
    welcomeFunction(client, member);
  });

  // Listen for the guildMemberRemove event
  client.on('guildMemberRemove', (member) => {
    const leaveEventFile = path.join(__dirname, '..', 'events', 'guildMemberRemove', 'leave.js');
    const leaveFunction = require(leaveEventFile);
    leaveFunction(client, member);
  });
  
};
