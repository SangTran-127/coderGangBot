import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
dotenv.config();
// setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});
// load commands
client.commands = new Collection();
// create path ../commands
const commandsPath = path.join(__dirname, "commands");
// read path => Array of js command file
const commandsFile = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));
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

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);
  console.log("sum ting right");
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});
client.on(Events.MessageCreate, (message) => {
  try {
    if (message.mentions.users.has(client.user.id)) {
      message.reply("Hey!.");
    }
    const badWords = [
      "dm",
      "cc",
      "dmm",
      "dcm",
      "dkm",
      "con cac",
      "loz",
      "lồn",
      "lol",
      "con cặc",
      "đụ má",
      "đụ mẹ",
      "đĩ",
    ];
    const greeting = [
      "xin chào",
      "hello",
      "hi",
      "hi mn",
      "hello mn",
      "hello mọi người",
      "hi mọi người",
    ];
    const sadReactions = ["sad", "hic", "huhu", "hjc", "hix", "hjx", "buồn"];
    const mess = message.content;
    if (badWords.includes(mess.toLowerCase())) {
      message.react("🤬");
      message.reply("Chửi thề con căk");
    }
    if (greeting.includes(mess.toLowerCase())) {
      message.react("😍");
      message.reply("Chào bạn 🥳");
    }
    if (sadReactions.includes(mess.toLowerCase())) {
      message.react("😢");
      message.reply("Đừng bùn");
    }
  } catch (error) {
    console.log(error);
  }
});
client.login(process.env.TOKEN);
