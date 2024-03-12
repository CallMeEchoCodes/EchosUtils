import { Events } from "discord.js";
import { EchosUtils } from "../index";
import type Event from "../types/Event";

const ready: Event = {
	trigger: Events.ClientReady,
	type: "once",
	run(client: EchosUtils): void {
		let username: string;
		if (client.user !== null) { username = client.user.tag; } else { username = "unknown"; }

		client.logger.log(`Logged in as ${username}!`, "SUCCESS");
	}
};

module.exports = ready;
