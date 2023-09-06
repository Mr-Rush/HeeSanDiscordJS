const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
  } = require('discord.js');
  
  module.exports = {
    /**
     *
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
      const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
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
    
        // Log the ban action in the "logs" channel
        const logsChannel = interaction.guild.channels.cache.find(
          (channel) => channel.name === 'logs'
        );
    
        if (logsChannel && logsChannel.isText()) {
          const banEmbed = {
            title: 'User Banned',
            color: 0xff0000, // Red color for error
            fields: [
              {
                name: 'Banned User',
                value: targetUser.user.tag,
              },
              {
                name: 'Banned By',
                value: interaction.user.tag,
              },
              {
                name: 'Reason',
                value: reason,
              },
            ],
            timestamp: new Date(),
          };
    
          await logsChannel.send({ embeds: [banEmbed] });
        }
    
        await interaction.editReply(`User ${targetUser} was banned\nReason: ${reason}`);
      } catch (error) {
        console.log(`There was an error when banning: ${error}`);
      }
    },
    
  
    name: 'ban',
    description: 'Bans a member from this server.',
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
  