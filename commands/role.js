import { SlashCommandBuilder } from "discord.js";

const data = new SlashCommandBuilder()
    .setName("role")
    .setDescription("Assign role for user")
    .addUserOption((option) =>
        option
            .setName("user")
            .setDescription("The user to assign role")
            .setRequired(true)
    )
    .addRoleOption((option) =>
        option
            .setName("role")
            .setDescription("The role to assign")
            .setRequired(true)
    );

const execute = async (interaction) => {
    const user = interaction.options.getUser("user");
    const role = interaction.options.getRole("role");
    await interaction.guild.members.cache.get(user.id).roles.add(role);
    await interaction.reply(`Added role ${role.name} to ${user.username}`);
}

export { data, execute };