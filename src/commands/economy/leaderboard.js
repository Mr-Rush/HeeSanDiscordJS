const { Client, Interaction, MessageEmbed, EmbedBuilder } = require('discord.js');
const Level = require('../../models/Level');

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply('You can only run this command inside a server.');
      return;
    }

    await interaction.deferReply();

    // Fetch the top 10 ranked users
    const allLevels = await Level.find({ guildId: interaction.guild.id }).select(
      '-_id userId level xp'
    );

    allLevels.sort((a, b) => {
      if (a.level === b.level) {
        return b.xp - a.xp;
      } else {
        return b.level - a.level;
      }
    });

    // Create an embed to display the top 10 ranked users
    const top10Users = allLevels.slice(0, 10);
    const embed = new EmbedBuilder()
      .setColor('#E91E63')
      .setTitle('Top 10 Ranked Users');

    for (let i = 0; i < top10Users.length; i++) {
      const user = await client.users.fetch(top10Users[i].userId);

      
      let rankEmoji = '';
      if (i === 0) {
        rankEmoji = '🥇'; // Rank #1
      } else if (i === 1) {
        rankEmoji = '🥈'; // Rank #2
      } else if (i === 2) {
        rankEmoji = '🥉'; // Rank #3
      }

      embed.addFields(
        {
          name: `${rankEmoji} #${i + 1} - ${user.tag}`,
          value: `Rank: ${i + 1}\nLevel: ${top10Users[i].level}`,
          inline: false,
        }
      );
    }

    interaction.editReply({ embeds: [embed] });
  },

  name: 'leaderboard',
  description: 'Displays the top 10 ranked users.',
};
