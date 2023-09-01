require("dotenv").config();
const {Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, PermissionsBitField, Permissions} = require("discord.js");
const eventHandler = require("./handlers/eventHandler");
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]})


eventHandler(client);


client.login(process.env.TOKEN)