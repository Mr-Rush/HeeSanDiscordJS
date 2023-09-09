const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    MessageEmbed,
    EmbedBuilder,
    PermissionFlagsBits,
    TextChannel,
} = require('discord.js');

module.exports = {
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get('target-user').value;

        await interaction.deferReply();

        // Fetch the banned users list from the guild
        const bans = await interaction.guild.bans.fetch();
        const bannedUser = bans.find((ban) => ban.user.id === targetUserId);

        if (!bannedUser) {
            await interaction.editReply("That user is not currently banned.");
            return;
        }

        try {
            // Unban the user
            await interaction.guild.members.unban(targetUserId);

            // Get the user tag before unbanning
            const unbannedUserTag = bannedUser.user.tag;

            targetUserId.send(`You have been unbanned \nPlease do not break any rules again as it will result in stricter punishment\nReason: ${reason}`)

            // Log the unban action in the "logs" channel
            const logsChannel = interaction.guild.channels.cache.find(
                (channel) => channel.name === 'logs'
            );

            if (logsChannel && logsChannel instanceof TextChannel) {
                const unbanEmbed = new EmbedBuilder()
            .setTitle("UNBAN | ${targetUserTag}")
            .setDescription("User has been unbanned")
            .setAuthor({
                name: targetUserTag,
                iconURL: targetUserAvatarURL
            })
            .addFields(
                {
                    name: "User",
                    value: "targetUserTag",
                    inline: true
                },
                {
                    name: "Moderator",
                    value: "interaction.user.tag",
                    inline: true
                },
                )
                .setColor("#00b0f4")
  .setFooter({
      text: "ID: ${targetUserId}",
    })
    .setTimestamp();
                
                
                await logsChannel.send({ embeds: [unbanEmbed] });
            } else {
                console.log("The 'logsChannel' is not a text channel. Unable to log unban action.");
            }

            await interaction.editReply(`User ${unbannedUserTag} has been unbanned.`);
        } catch (error) {
            console.error(`There was an error when unbanning: `, error);
        }
    },

    name: 'unban',
    description: 'Unbans a previously banned member from this server.',
    options: [
        {
            name: 'target-user',
            description: 'The user you want to unban.',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.BanMembers],
    botPermissions: [PermissionFlagsBits.BanMembers],
};
