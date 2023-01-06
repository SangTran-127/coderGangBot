import { Events, Client, GatewayIntentBits } from "discord.js";
import { checkWord } from "../utils/index.js";
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});
const name = Events.MessageCreate;
const once = false;
function execute(message) {
  try {
    if (checkWord(message.content, "bad")) {
      message.react("🤬");
      message.reply("Chửi thề con căk");
    }
    if (checkWord(message.content, "greetings")) {
      message.react("😍");
      message.reply("Chào bạn 🥳");
    }
  } catch (error) {
    console.log(error);
  }
}

export { name, once, execute };
