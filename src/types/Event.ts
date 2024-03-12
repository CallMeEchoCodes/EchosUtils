import { ClientEvents } from "discord.js";
import { EchosUtils } from "..";

interface Event {
    trigger: keyof ClientEvents
    type: "on" | "once"
    run: (client: EchosUtils, ...args) => void
}

export default Event;
