import { Client, Collection, GatewayIntentBits, Partials, REST, RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord.js";
import { readdirSync } from "fs";
import Simpllog from "simpllog";
import config from "../config.json";
import type Command from "./types/Command";
import type Event from "./types/Event";

export class EchosUtils extends Client {
	commands: Collection<unknown, Command>;
	config: {
		clientId: string,
		guildId: string,
		token: string,
		presence: { activities: Array<{ name: string }> },
		production: boolean
	};
	logger: Simpllog;

	constructor() {
		super({
			intents: [
				GatewayIntentBits.DirectMessages,
				GatewayIntentBits.Guilds
			],
			partials: [
				Partials.Channel
			],
			presence: config.presence
		});

		this.config = config;
		this.commands = new Collection();
		this.logger = new Simpllog({ production: config.production });
	}

	async loadEvents(path: string): Promise<void> {
		this.logger.log("Loading Events...", "INFO");
		const EventFiles = readdirSync(`${path}`).filter(file => file.endsWith(".js"));
		for (const file of EventFiles) {
			const eventFile = file;
			const event: Event = await import(`${path}/${eventFile}`);

			if (event.type === "once") super.once(event.trigger, (...args) => event.run(this, ...args));
			else super.on(event.trigger, (...args) => event.run(this, ...args));
			this.logger.log(`Loaded ${eventFile} - ${event.trigger} Event`, "INFO");
		}
		this.logger.log("Registered all events!", "SUCCESS");
	}

	async loadCommands(path: string): Promise<void> {
		this.logger.log("Loading Commands...", "INFO");
		const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];
		const commandFolders = readdirSync(path);
		for (const folder of commandFolders) {
			if (folder.endsWith(".js")) {
				this.logger.log(`Command ${folder} is not in a subdirectory! It has been ignored, please move it.`, "WARN");
				continue;
			}
			if (folder.endsWith(".map")) continue;
			const commandFiles = readdirSync(`${path}/${folder}`).filter(file => file.endsWith(".js"));
			for (const file of commandFiles) {
				const Command = await import(`${path}/${folder}/${file}`);
				const command = Command as unknown as Command;
				commands.push(command.data.toJSON());
				this.commands.set(command.data.name, command);
				this.logger.log(`Loaded ${file} - ${command.data.name} Command`, "INFO");
			}
			if (this.config.production) {
				const rest = new REST({ version: "9" }).setToken(this.config.token);

				try {
					await rest.put(
						Routes.applicationCommands(this.config.clientId),
						{ body: commands }
					);
					this.logger.log("Registered all commands!", "SUCCESS");
				} catch (error) {
					this.logger.log(error, "ERROR");
				}
			} else {
				void (async () => {
					const rest = new REST({ version: "9" }).setToken(this.config.token);
					try {
						await rest.put(
							Routes.applicationGuildCommands(this.config.clientId, this.config.guildId),
							{ body: commands }
						);

						this.logger.log("Registered all commands!", "SUCCESS");
					} catch (error) {
						this.logger.log(error, "ERROR");
					}
				})();
			}
		}
	}

	async loadAll(): Promise<void> {
		await this.loadEvents("./events");
		await this.loadCommands("./commands");
	}

	public start(token: string): void {
		super.login(token).catch(() => {
			this.logger.log("Failed to login to Discord!", "ERROR");
			process.exit(1);
		});
	}
}

const client = new EchosUtils();

client.loadAll();

client.login(client.config.token);
