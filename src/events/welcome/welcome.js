const fs = require('fs');
const Canvas = require('@napi-rs/canvas');
const { request } = require('undici');

module.exports = async (client, member) => {
  const welcomeChannel = member.guild.channels.cache.find(
    (channel) => channel.name === 'welcome' // Change 'welcome' to the name of your welcome channel
  );

  if (welcomeChannel) {
    try {
      // Create a 700x250 pixel canvas and get its context
      const canvas = Canvas.createCanvas(700, 250);
      const context = canvas.getContext('2d');

      // Load the background image (wallpaper.jpg)
      const background = await Canvas.loadImage('src/events/welcome/WelcomeIMG.jpg');
      context.drawImage(background, 0, 0, canvas.width, canvas.height);

      // Load the user's avatar and make it a circle
      const { body } = await request(member.user.displayAvatarURL({ format: 'jpg' }));
      const avatar = await Canvas.loadImage(await body.arrayBuffer());
      context.beginPath();
      context.arc(125, 125, 100, 0, Math.PI * 2, true);
      context.closePath();
      context.clip();
      context.drawImage(avatar, 25, 25, 200, 200);

      // Add text to the image (Welcome! Username, You are the Xth member of Guildname)
      context.font = '28px sans-serif';
      context.fillStyle = '#ffffff';
      context.fillText('Welcome!', canvas.width / 3.5, canvas.height / 3.5);
      context.fillText(member.displayName, canvas.width / 3.5, canvas.height / 2.5);
      context.fillText(`You are the ${member.guild.memberCount}th member of ${member.guild.name}`, canvas.width / 3.5, canvas.height / 2);

      // Save the image to a file
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync('profile-image.png', buffer);

      // Send the image as an attachment along with a welcome message
      await welcomeChannel.send(`Welcome to the server, <@${member.id}>! You are the ${member.guild.memberCount}th member of ${member.guild.name}.`, {
        files: [canvas.toBuffer()],
      });


      console.log('Image sent successfully.');
    } catch (error) {
      console.error('Error:', error);
    }
  }
};
