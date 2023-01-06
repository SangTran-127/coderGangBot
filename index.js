import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
// import { checkWord } from "./utils/index.js";
dotenv.config();
// setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// create path ../commands
const commandsPath = path.join(__dirname, "commands");
const eventsPath = path.join(__dirname, "events");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});
// read path => Array of js command file
const commandsFile = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));
const eventsFile = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));
// load commands
client.commands = new Collection();

// #TODO: REGISTING SLASH COMMANDS
for (const file of commandsFile) {
  const filePath = path.join(commandsPath, file);
  const command = await import(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ("data" in command && "execute" in command) {
    // luu vo nhu cai Map, ban chat Collection() cua discord la Map
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}
for (const file of eventsFile) {
  const filePath = path.join(eventsPath, file);
  const event = await import(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}
client.login(process.env.TOKEN);
