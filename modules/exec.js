module.exports = {
    name: 'eval',
    type: 'owner',
    usage: 'eval <code>',
    permission: 6,
    help: 'Allows bot administrators to evaluate code to test the bot.',
    main: function (bot, msg) {
        var Discord = require('discord.js');

        if (msg.author.id === require("../config.json").owner) {
            var embed = new Discord.RichEmbed()
                .setFooter(`${msg.author.username}`, `${msg.author.avatarURL}`)
                .setTimestamp()
                .addField('Command', "```sh\n" + msg.content + "```")

            require("child_process").exec(msg.content, (err, stdout, stderr) => {
                if (err) {
                    embed.setColor(0xFF0000)
                        .setTitle("Command Execution Error")
                        .addField('Error', "```sh\n" + stderr + "```")
                        .addField('Result', "```sh\n" + stdout + "```");
                }
                else {
                    embed.setColor(0x00FF00)
                        .setTitle("Command Execution Success")
                        .addField('Result', "```sh\n" + stdout + "```");
                }
                msg.channel.send({ embed: embed })
            })
        }
        else {
            msg.reply("you do not have permission to use this command!");
        }
    }
}
