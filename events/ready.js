import { Events } from "discord.js";

const name = Events.ClientReady;
const once = true;
function execute(client) {
  console.log(`${client.user.username} is Ready`);
}
export { name, once, execute };
