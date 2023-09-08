const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
  TextChannel,
} = require('discord.js');

// Initialize a ban case counter
let banCaseCounter = 0;

module.exports = {

  name: 'ban',
  description: 'Bans a member from this server.',
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
      const targetUserId = interaction.options.get('target-user').value;
      const reason = interaction.options.get('reason')?.value || 'No reason provided';

      await interaction.deferReply();

      const targetUser = await interaction.guild.members.fetch(targetUserId);

      if (!targetUser) {
          await interaction.editReply("That user doesn't exist in this server.");
          return;
      }

      if (targetUser.id === interaction.guild.ownerId) {
          await interaction.editReply(
              "You can't ban that user because they're the server owner."
          );
          return;
      }

      const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
      const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the command
      const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

      if (targetUserRolePosition >= requestUserRolePosition) {
          await interaction.editReply(
              "You can't ban that user because they have the same/higher role than you."
          );
          return;
      }

      if (targetUserRolePosition >= botRolePosition) {
          await interaction.editReply(
              "I can't ban that user because they have the same/higher role than me."
          );
          return;
      }

      // Ban the targetUser
      try {
          await targetUser.ban({ reason });

          // Increment the ban case counter
          banCaseCounter++;

          const targetUserTag = targetUser.user.tag;
          const targetUserAvatarURL = targetUser.displayAvatarURL();
          
          console.log('Target User Tag:', targetUserTag);
          console.log('Avatar URL:', targetUserAvatarURL);
          
          // Log the ban action in the "logs" channel
          const logsChannel = interaction.guild.channels.cache.find(
              (channel) => channel.name === 'logs'
          );
          
          if (logsChannel && logsChannel instanceof TextChannel) {
              const banEmbed = new EmbedBuilder()
            .setTitle( banCaseCounter + ` | BAN | ${targetUserTag}`)
            .setDescription("User has been banned")
            .setAuthor({
                name: targetUserTag,
                iconURL: targetUserAvatarURL
            })
            .addFields(
                {
                    name: "User",
                    value: targetUserTag,
                    inline: true
                },
                {
                    name: "Moderator",
                    value: interaction.user.tag,
                    inline: true
                },
                {
                    name: "Reason",
                    value: reason,
                    inline: true
                },
                )
                .setColor("#00b0f4")
  .setFooter({
      text: `ID: ${targetUserId}`,
    })
    .setTimestamp();
    
    await logsChannel.send({ embeds: [banEmbed] });
} else {
    console.log("The 'logsChannel' is not a text channel. Unable to log ban action.");
}

await interaction.editReply(`User ${targetUserTag} was banned\nReason: ${reason}`);
} catch (error) {
    console.error(`There was an error when banning: `, error);
}
},

  
  options: [
      {
          name: 'target-user',
          description: 'The user you want to ban.',
          type: ApplicationCommandOptionType.Mentionable,
          required: true,
      },
      {
          name: 'reason',
          description: 'The reason you want to ban.',
          type: ApplicationCommandOptionType.String,
      },
  ],
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],
};
