module.exports = async (client, member) => {
    const welcomeChannel = member.guild.channels.cache.find(
      (channel) => channel.name === 'welcome-test' // Change 'welcome' to the name of your welcome channel
    );
  
    if (welcomeChannel) {
      welcomeChannel.send(`Welcome to the server, ${member.user.tag}!`);
    }
  };
  