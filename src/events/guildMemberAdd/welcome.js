const { EmbedBuilder } = require('discord.js');

module.exports = async (client, member) => {
  const embedData = {
    "type": "rich",
    "title": "Welcome to the server!",
    "description": `Welcome to the server, <@${member.id}>!`,
    "color": 0x00099f,
    "fields": [
      {
        "name": "Member count",
        "value": `You are the ${member.guild.memberCount}th member of ${member.guild.name}`,
      },
    ],
    "thumbnail": {
      "url": `https://media.discordapp.net/attachments/1147234161996857375/1147285495211106354/YAAAAYYY.gif`,
      "height": 0,
      "width": 0
    }
  };

  const channel = member.guild.channels.cache.find((ch) => ch.name === 'welcome✦-ˑ-ִֶָ-𓂃⊹');
  if (channel) {
    // Send a normal message tagging the user
    await channel.send(`🎉 Welcome to the server, <@${member.id}>!`)
      .catch(console.error);

    console.log(`<${member.user.tag}> Joined the server!`)

    // Send the welcome message with the embed
    await channel.send({ embeds: [embedData] })
      .catch(console.error);

  }
};
