// leave.js
module.exports = (client) => {
    client.on("guildMemberRemove", member => {

    //   console.log(`Member ${member.user.tag} left the server.`);
    
      const channelID = `1147555275541319750`;
    
      const message = `**${member} Just left the server.**`;
  
      const channel = member.guild.channels.cache.get(channelID);
  
      channel.send(message)
        .then(() => console.log(`Leave message sent successfully.`))
        .catch(error => console.error(`Error sending leave message: ${error}`));
    });
  };
  