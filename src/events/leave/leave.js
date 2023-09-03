module.exports = async (client, member) => {

  const channel = member.guild.channels.cache.find((ch) => ch.name === 'welcome');
  if (channel) {
    // Send a normal message tagging the user
    await channel.send(`👋 <@${member.id}>, Sadly left the server`)
      .catch(console.error);

      console.log(`${member.user.tag} left the server.`);

  }
};
