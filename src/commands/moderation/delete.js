module.exports = {
    name: 'delete',
    description: 'Delete a specified number of messages in the channel',
    usage: '/delete <number>',
  
    callback: (client, message, args) => {
      // Check if the user has permission to manage messages
      if (!message.member.permissions.has('MANAGE_MESSAGES')) {
        return message.reply("You don't have permission to use this command.");
      }
  
      // Check if the command has the correct number of arguments
      if (args.length !== 1 || isNaN(args[0])) {
        return message.reply('Please provide a valid number argument.');
      }
  
      const numberOfMessagesToDelete = parseInt(args[0]);
  
      // Check if the number of messages to delete is within a valid range
      if (numberOfMessagesToDelete < 1 || numberOfMessagesToDelete > 100) {
        return message.reply('Please provide a number between 1 and 100.');
      }
  
      // Fetch and delete the specified number of messages
      message.channel
        .bulkDelete(numberOfMessagesToDelete, true)
        .then((deletedMessages) => {
          message.reply(`Deleted ${deletedMessages.size} messages.`);
        })
        .catch((error) => {
          console.error('Error deleting messages:', error);
          message.reply('An error occurred while deleting messages.');
        });
    },
  };
  