import { CommandInteraction, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import { EchosUtils } from "..";

interface Command {
    data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
    run: (interaction: CommandInteraction, client: EchosUtils) => Promise<void>;
}

export default Command;
