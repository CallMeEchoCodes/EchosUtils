import { ColorResolvable, CommandInteraction, EmbedBuilder, Message, SlashCommandBuilder } from "discord.js";
import { EchosUtils } from "../..";
import Command from "../../types/Command";

const ping: Command = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("See the bots latency."),

	async run(interaction: CommandInteraction, _client: EchosUtils): Promise<void> {
		interaction.channel?.send("Pinging...").then((msg: Message) => {
			const ping = msg.createdTimestamp - interaction.createdTimestamp;
			let color = "RANDOM" as ColorResolvable;
			if (ping < 150) {
				color = "Green";
			} else if (ping > 150 && ping < 250) {
				color = "Yellow";
			} else if (ping > 250) {
				color = "Red";
			}
			const embed = new EmbedBuilder()
				.setColor(color)
				.setTitle("Pong!")
				.addFields(
					{ name: "⌛ Roundtrip Latency", value: `${ping}ms`, inline: true }
				);
			void msg.delete();
			void interaction.reply({ embeds: [embed] });
		});
	}
};

module.exports = ping;
