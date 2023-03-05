import { getVoiceConnection } from "@discordjs/voice";
import { EmbedBuilder, SlashCommandBuilder, VoiceChannel, GuildEmoji } from "discord.js";
import { Queue } from "distube";
// get client from index.js
const data = new SlashCommandBuilder()
    .setName( "music" )
    .setDescription( "Play a song" )
    .addSubcommand( subcommand =>
        subcommand.setName( "play" )
            .setDescription( "Play a song" )
            .addStringOption( option =>
                option.setName( "query" )
                    .setDescription( "The name or URL" )
                    .setRequired( true )
            )
    )
    .addSubcommand( subcommand =>
        subcommand.setName( "volume" )
            .setDescription( "Change volume" )
            .addIntegerOption( option =>
                option.setName( "volume" )
                    .setDescription( "10 = 10%" )
                    .setMinValue( 1 )
                    .setMaxValue( 100 )
                    .setRequired( true )
            )
    )
    .addSubcommand( subcommand =>
        subcommand.setName( "options" )
            .setDescription( "Select options" )
            .addStringOption( option =>
                option.setName( "option" )
                    .setDescription( "Select an option" )
                    .setRequired( true )
                    .addChoices(
                        { name: "queue", value: "value" },
                        { name: "skip", value: "skip" },
                        { name: "stop", value: "stop" },
                        { name: "pause", value: "pause" },
                        { name: "resume", value: "resume" },
                    )
            )
    );
const execute = async ( interaction ) => {
    let client = interaction.client;
    const { options, member, guild, chanel } = interaction;
    const subcommand = options.getSubcommand();
    const query = options.getString( "query" );
    const volume = options.getInteger( "volume" );
    const option = options.getString( "option" );
    //get the voice channel the member is in
    const voiceChannel = member.voice.channel;


    const embed = new EmbedBuilder()

    if ( !voiceChannel ) {
        embed.setTitle( "You need to be in a voice channel to play music!" );
        return await interaction.reply( { embeds: [ embed ] } );
    }

    // if ( queue ) {
    //     if ( interaction.member.guild.me.voice.channelId !== interaction.member.voice.channelId ) {
    //         return interaction.reply( { content: "You are not on the same voice channel as me!" } )
    //     }
    // }

    try {
        switch ( subcommand ) {
            case "play":
                //play music
                getVoiceConnection( interaction.guildId )?.configureNetworking()
                client.distube.play( voiceChannel, query, { textChanel: chanel, member: member } )
                return interaction.reply( { content: `Playing ${ query }` } );
            case "volume":
                client.distube.setVolume( guild.id, volume );
                return interaction.reply( { content: `Volumn change to ${ volume }%` } )
            case "options":
                switch ( option ) {
                    case "queue":
                        client.distube.getQueue( guild.id );
                        return interaction.reply( { content: client.distube.getQueue( guild.id ) } )
                    case "skip":
                        client.distube.skip( guild.id );
                        return interaction.reply( { content: "success" } )
                    case "stop":
                        client.distube.stop( guild.id );
                        return interaction.reply( { content: "success" } )
                    case "pause":
                        client.distube.pause( guild.id );
                        return interaction.reply( { content: "success" } )
                    case "resume":
                        client.distube.resume( guild.id );
                        return interaction.reply( { content: "success" } )
                }
                break;
        }
    }
    catch ( error ) {
        console.log( error );
        embed.setTitle( "An error occurred while playing music!" );
        return interaction.reply( { embeds: [ embed ] } );
    }
}
export { data, execute };