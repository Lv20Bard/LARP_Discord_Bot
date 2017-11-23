const Commando = require('discord.js-commando');
const {SQLiteProvider, CommandoClient} = require('discord.js-commando');
const path = require('path');
const PersistentCollection = require('djs-collection-persistent');
const client = new Commando.Client();
const token = 'MzQ0ODM4ODU5MzExNTQ2Mzc4.DGyjuw.IR-qbWz9TQ_PaqJt-_l4q0gfsKs';
const sqlite = require('sqlite');

const {oneLine} = require('common-tags');


client
    .on('error', console.error)
    .on('warn', console.warn)
    .on('debug',console.debug)
    .on('ready', () => {
        console.log('I\'m dead now, and thats sad!');
        client.user.setGame("Underworld LARP");
    })
    .on('disconnect', () => {
        console.warn('Disconnected!');
    })
    .on('reconnecting', () => {
        console.warn('Reconnecting ...');
    })
    .on('commandError', (cmd, err) => {
        if(err instanceof Commando.FriendlyError) return;
        console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
    })
    .on('commandBlocked', (msg, reason) => {
        console.log(oneLine`
            Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
            blocked; ${reason}
        `);
    })
    .on('commandPrefixChange', (guild, prefix) => {
        console.log(oneLine`
            Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
            ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
        `);
    })
    .on('commandStatusChange', (guild, command, enabled) => {
        console.log(oneLine`
            Command ${command.groupID}:${command.memberName}
            ${enabled ? 'enabled' : 'disabled'}
            ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
        `);
    })
    .on('groupStatusChange', (guild, group, enabled) => {
        console.log(oneLine`
            Group ${group.id}
            ${enabled ? 'enabled' : 'disabled'}
            ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
        `);
    });

sqlite.open(path.join(__dirname, "settings.sqlite3")).then((db) => {
    client.setProvider(new SQLiteProvider(db));
});


client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['information','Rules Information'],
        ['utility','Fun and Useful commands']
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));



client.login(token);