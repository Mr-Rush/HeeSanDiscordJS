module.exports = {
  name: 'reactionrole',
  description: 'Add multiple reaction roles to a message.',
  permissions: ['MANAGE_ROLES'],
  args: true,
  guildOnly: true,
  cooldown: 5,


  callback: (client, interaction) => {
    interaction.reply(`Currently working on this command`);
  },
};
