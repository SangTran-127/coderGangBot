import { REST, Routes } from "discord.js";
import fs from "fs";
import * as dotenv from "dotenv";
dotenv.config();

let applicationId = process.env.APPLICATION_ID;
// get the context of the server
// let guildId = process.env.GUILD_ID;
const commands = [];
// lay tat ca cac file trong folder commands
const commandFiles = fs.readdirSync( "./commands" ).filter( ( file ) => file.endsWith( ".js" ) );

// lay tat ca cac command trong folder commands
for ( const file of commandFiles ) {
    const command = await import( `./commands/${ file }` );
    commands.push( command.data.toJSON() );
}
// tao 1 REST client
const rest = new REST( { version: "10" } ).setToken( process.env.TOKEN );
// deploy commands
( async () => {
    try {
        console.log( `Started refreshing ${ commands.length } (/) commands.` );
        // xoa tat ca cac command trong server
        const data = await rest.put(
            Routes.applicationCommands( applicationId ),
            { body: commands } );
        console.log( `Successfully reloaded ${ data.length } application (/) commands.` );
    } catch ( error ) {
        console.error( error );
    }
} )();



