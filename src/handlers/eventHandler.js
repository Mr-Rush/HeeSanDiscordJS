// eventHandler.js
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

  // Add this block to listen for the guildMemberAdd event
  client.on('guildMemberAdd', (member) => {
    const welcomeEventFile = path.join(__dirname, '..', 'events', `welcome`, 'welcome.js');
    const welcomeFunction = require(welcomeEventFile);
    welcomeFunction(client, member);
  });
};
