const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    EmbedBuilder,
    TextChannel,
  } = require('discord.js');
  const fs = require('fs');
  
  // Initialize the ban case counter by reading from the JSON file
  let banData = readBanDataFromFile();
  
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
        // Attempt to send the ban notification DM to the user
        try {
          await targetUser.send(`You have been **banned** from Chung and the fellas\n\nReason: ${reason}`);
        } catch (error) {
          if (error.code === 50007) {
            console.log(`Could not send a DM to ${targetUser.user.tag} (User has DMs disabled).`);
          } else {
            // Handle other errors if necessary
            console.error(`Error sending DM to ${targetUser.user.tag}: ${error.message}`);
          }
        }
  
        await targetUser.ban({ reason });
  
        // Increment the ban case counter
        banData.banCaseCounter++;
  
        // Save the updated banData to the JSON file
        saveBanDataToFile(banData);
  
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
            .setTitle(`${banData.banCaseCounter} | BAN | ${targetUserTag}`)
            .setDescription("User has been banned")
            .setAuthor({
              name: targetUserTag,
              iconURL: targetUserAvatarURL,
            })
            .addFields(
              {
                name: "User",
                value: targetUserTag,
                inline: true,
              },
              {
                name: "Moderator",
                value: interaction.user.tag,
                inline: true,
              },
              {
                name: "Reason",
                value: reason,
                inline: true,
              }
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
  
        // ... your existing code ...
      } catch (error) {
        console.error(`There was an error when banning: `, error);
      }
    },
  
    // ... your other code ...
  };
  
  function readBanDataFromFile() {
    try {
      // Read the JSON file and parse its content
      const rawData = fs.readFileSync('./src/json/banData.json', 'utf-8');
      return JSON.parse(rawData);
    } catch (error) {
      console.error('Error reading banData from file:', error);
      return { banCaseCounter: 0 };
    }
  }
  
  function saveBanDataToFile(data) {
    try {
      // Convert the data to JSON format and save it to the file
      const jsonData = JSON.stringify(data, null, 2);
      fs.writeFileSync('./src/json/banData.json', jsonData, 'utf-8');
    } catch (error) {
      console.error('Error saving banData to file:', error);
    }
  }
  