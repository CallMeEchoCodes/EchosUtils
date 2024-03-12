import { CommandInteraction, EmbedBuilder, GuildEmoji, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { EchosUtils } from "../..";
import Command from "../../types/Command";

const grabEmoji: Command = {
	data: new SlashCommandBuilder()
		.setName("grabemoji")
		.setDescription("Grab emojis from other servers with or without nitro!")
		.addStringOption(option => option.setName("name")
			.setDescription("The name of the emoji")
			.setRequired(true))
		.addStringOption(option => option.setName("url")
			.setDescription("The URL of the emoji")
			.setRequired(true))
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuildExpressions),

	async run(interaction: CommandInteraction, _client: EchosUtils): Promise<void> {
		const guild = interaction.guild;
		if (guild == null) return; // This should never happen. Just to make TS happy

		const name = interaction.options.get("name", true).value as string;
		const url = interaction.options.get("url", true).value as string;
		let emoji: GuildEmoji;
		try {
			emoji = await guild.emojis.create({ attachment: url, name: name });
		} catch (err) {
			const embed = new EmbedBuilder()
				.setTitle("Failed to add emoji")
				.setDescription("There was an error while adding the emoji. Make sure the URL is valid and the emoji name is not already taken.");
			void interaction.reply({ embeds: [embed] });
			return;
		}
		const embed = new EmbedBuilder()
			.setTitle("Emoji added!")
			.setDescription(`Emoji ${emoji} has been added to the server`);
		void interaction.reply({ embeds: [embed] });
	}
};

module.exports = grabEmoji;
