import { CommandInteraction, Events, InteractionType } from "discord.js";
import { EchosUtils } from "..";
import Command from "../types/Command";
import type Event from "../types/Event";

const commandHandler: Event = {
	trigger: Events.InteractionCreate,
	type: "on",
	async run(client: EchosUtils, interaction: CommandInteraction): Promise<void> {
		if (interaction.type !== InteractionType.ApplicationCommand) return client.logger.log("Interaction is not a command", "DEBUG");

		const command: Command | undefined = client.commands.get(interaction.commandName);
		if (command == null) {
			await interaction.reply({ content: "There was an error while executing that command!", ephemeral: true });
			return;
		}

		try {
			command.run(interaction, client);
		} catch (err) {
			client.logger.log(`Failed to run ${command.data.name} for user ${interaction.user.tag}. ${err as string}`, "ERROR");
			await interaction.reply({ content: "There was an error while executing that command!", ephemeral: true });
			return;
		}
	}
};

module.exports = commandHandler;
