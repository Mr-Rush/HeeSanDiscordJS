const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');
const calculateLevelXp = require('../../utils/calculateLevelXp');
const Level = require('../../models/Level');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    // Reply with the development message
    await interaction.reply('This command is currently in development.');
  },



    // await interaction.deferReply();

    // const mentionedUserId = interaction.options.get('target-user')?.value;
    // const targetUserId = mentionedUserId || interaction.member.id;
    // const targetUserObj = await interaction.guild.members.fetch(targetUserId);

    // const fetchedLevel = await Level.findOne({
    //   userId: targetUserId,
    //   guildId: interaction.guild.id,
    // });

    // if (!fetchedLevel) {
    //   interaction.editReply(
    //     mentionedUserId
    //       ? `${targetUserObj.user.tag} doesn't have any levels yet. Try again when they chat a little more.`
    //       : "You don't have any levels yet. Chat a little more and try again."
    //   );
    //   return;
    // }

    // // Create an embedded message using EmbedBuilder with the specified format
    // const embed = new EmbedBuilder()
    //   .setAuthor({
    //     name: `${targetUserObj.user.tag} Level`,
    //   })
    //   .setTitle(`The level of ${targetUserObj.user.tag}`)
    //   .addFields(
    //     {
    //       name: "A New Field",
    //       value: "",
    //       inline: true,
    //     },
    //     {
    //       name: "A New Field",
    //       value: "",
    //       inline: false,
    //     },
    //     {
    //       name: "A New Field",
    //       value: "",
    //       inline: false,
    //     },
    //     {
    //       name: "A New Field",
    //       value: "",
    //       inline: false,
    //     }
    //   )
    //   .setColor("#00b0f4");

    //   try {
    //     await interaction.editReply({ embeds: [embed] });
    //   } catch (error) {
    //     console.error('An error occurred:', error);
    //   }
      
    
  // },

  name: 'level',
  description: "Shows your/someone's level.",
  options: [
    {
      name: 'target-user',
      description: 'The user whose level you want to see.',
      type: ApplicationCommandOptionType.Mentionable,
    },
  ],
};
