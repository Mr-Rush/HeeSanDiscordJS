const { Client, Interaction, ApplicationCommandOptionType, MessageEmbed, EmbedBuilder } = require('discord.js');
const ModerationLog = require('../../models/ModerationLog'); // Import the model for logging

module.exports = {
  name: 'modlogs',
  description: 'List moderation logs for a user.',

  callback: async (client, interaction) => {
    const targetUser = interaction.options.get('target-user').user;
    const page = interaction.options.get('page')?.value || 1; // Default to page 1 if not specified
    const logsPerPage = 3; // Number of logs to display per page

    // Retrieve moderation logs for the specified user from the database
    const logs = await ModerationLog.find({ targetUserId: targetUser.id })
      .sort({ timestamp: -1 }) // Sort by timestamp in descending order (newest first)
      .skip((page - 1) * logsPerPage) // Skip records for previous pages
      .limit(logsPerPage); // Limit the number of records per page

    if (logs.length === 0) {
      await interaction.reply(`No moderation logs found for ${targetUser.tag}.`);
      return;
    }

    // Create an embed to display the logs
    const embed = new EmbedBuilder()
      .setColor('#00b0f4')
      .setTitle(`Modlogs for ${targetUser.tag} (Page ${page} of ${Math.ceil(logs.length / logsPerPage)})`);

    for (const log of logs) {
      embed.addFields(`Case ${log._id}`, 
        `Type: ${log.action}\n` +
        `User: ${log.targetUserId} ${targetUser.tag}\n` +
        `Moderator: ${log.moderatorId}\n` +
        `Reason: ${log.reason}\n` +
        `Timestamp: ${log.timestamp.toLocaleString()}`
      );
    }

    embed.setFooter(`${logs.length} total logs | Use .modlogs [user] [page] to view another page`);

    await interaction.reply({ embeds: [embed] });
  },

  options: [
    {
      name: 'target-user',
      description: 'The user whose moderation logs you want to view.',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'page',
      description: 'The page number of moderation logs to view.',
      type: ApplicationCommandOptionType.Integer,
    },
  ],
};
