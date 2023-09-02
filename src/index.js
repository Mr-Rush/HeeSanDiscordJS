require('dotenv').config();
const { Client, IntentsBitField, GatewayIntentBits } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
// const welcome = require(`../src/events/ready/welcome.js`)

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});



eventHandler(client);

client.login(process.env.TOKEN);
