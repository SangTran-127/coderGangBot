import { Events, Client, GatewayIntentBits } from "discord.js";
import { Configuration, OpenAIApi } from "openai";
import { checkWord } from "../utils/index.js";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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
async function execute(message) {
  try {
    if (message.author.bot) return;
    if (message.channelId === "853687060459028550") {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `theCoderGang is a friendly chatbot.\n\
        theCoderGang: Hello, how are you?\n\
        ${message.author.username}: ${message.content}
        `,
        temperature: 0,
        max_tokens: 1000,
      });
      message.reply(`${response.data.choices[0].text}`);
    } else {
      if (checkWord(message.content, "bad")) {
        message.react("🤬");
        message.reply("Chửi thề con căk");
      }
      if (checkWord(message.content, "greetings")) {
        message.react("😍");
        message.reply("Chào bạn 🥳");
      }
    }
  } catch (error) {
    console.log(error);
  }
}

export { name, once, execute };
