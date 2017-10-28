//Work on finishing botrole, antiinvite, antimentionspam

module.exports = {
	name: 'settings',
	type: 'core',
	usage: 'settings <arguments>',
	permission: 4,
	help: 'Changes server settings.',
	main: function (bot, msg) {
		var validSettings = ['announcementChannel', 'welcomeMessage', 'leaveMessage', 'banMessage', 'joinRole', 'botRole', 'inviteLinks', 'mentionSpam'],
			joinLeaveSettings = ['welcomeMessage', 'leaveMessage', 'banMessage'],
			channelSettings = ['announcementChannel'],
			roleSettings = ['joinRole', 'botRole'],
			booleanSettings = ['inviteLinks', 'mentionSpam'],
			acceptedArgs = "``{server:name}``, ``{user:username}``, ``{user:mention}``, ``{user:discrim}``, ``{server:membercount}``";

		if (!msg.member.hasPermission('MANAGE_GUILD')) return msg.reply("you do not have permission to manage this server's setings!")

		if (!msg.args[0]) {
			//Print out all the settings 
		} else if (joinLeaveSettings.indexOf(msg.args[0])) {
			bot.getCurrentBooleanSetting(msg.args[0], msg.guild.id).then(value => {
				processJoinLeaveSettings(msg.args[0], value)
			})
		} else if (channelSettings.indexOf(msg.args[0])) {
			console.log("Channel Setting: " + msg.args[0])
			bot.getCurrentChannelSetting(msg.args[0], msg.guild.id).then(value => {
				processChannelSetting(msg.args[0], value);
			})
		} else if (roleSettings.indexOf(msg.args[0])) {

		} else if (booleanSettings.indexOf(msg.args[0])) {

		}
		else
			msg.reply("please specify a valid argument! Accepted arguments: announcementChannel, welcomeMessage, leaveMessage, banMessage, joinRole, botRole, inviteLinks, mentionSpam")

		function processJoinLeaveSettings(setting, value) {
			msg.channel.send(`The ${setting} for this server is **${value ? 'on' : 'off'}**. Do you want to turn it **${value ? 'off' : 'on'}**? (Reply with 'yes' or 'no')`);
			var collector = msg.channel.createCollector(
				m => (m.content.toLowerCase() == 'yes' || m.content.toLowerCase() == 'no'),
				{ time: 30000 }
			);
			collector.on('collect', m => {
				var val = value;
				if (m.content.toLowerCase() == 'yes' && m.author.id == msg.author.id) {
					if (value)
						value = 0
					else
						value = 1
					val = bot.setNewValue(setting, msg.guild, value)
					msg.channel.send(`${setting} ${e ? 'enabled' : 'disabled'}.`);
					collector.stop();
				} else if (m.content.toLowerCase() == 'no' && m.author.id == msg.author.id) {
					msg.channel.send(`The ${setting} is staying **${value ? 'on' : 'off'}**.`)
					collector.stop();
				}
				if (val) {
					msg.channel.send(`What would you like the ${setting} to be? You may include the following arguments in your welcome message: ${args}`)
					var collector2 = msg.channel.createCollector(
						m => msg.author.id == m.author.id,
						{ time: 60000 }
					);
					collector2.on('message', m => {
						m.channel.send(`${setting} set to \`${bot.setNewValue(setting, m.guild.id, m.content)}\`!`)
						collector2.stop();
					});
					collector2.on('end', collected => {
						if (collected.size == 0)
							msg.channel.send("No messages were detected within 60 seconds. Aborting...")
						console.log(`Collected ${collected.size} items`)
					});
				}
			});
			collector.on('end', collected => {
				if (collected.size == 0)
					msg.channel.send("No messages were detected within 30 seconds. Aborting...")
				console.log(`Collected ${collected.size} items`)
			});
		}

		function processChannelSetting(setting, value) {
			msg.channel.send(`The current ${setting} for this server is <#${value}>. Do you want to change it? (Reply with 'yes' or 'no')`);
			var collector = msg.channel.createCollector(
				m => (m.content.toLowerCase() == 'yes' || m.content.toLowerCase() == 'no'),
				{ time: 30000 }
			);
			collector.on('collect', m => {
				var change = false;
				if (m.content.toLowerCase() == 'yes' && m.author.id == msg.author.id) {
					change = true
					collector.stop();
				} else if (m.content.toLowerCase() == 'no' && m.author.id == msg.author.id) {
					msg.channel.send(`The ${setting} will remain as <#${value}>.`)
					collector.stop();
				}
				if (change) {
					msg.channel.send(`What would you like the ${setting} to be? (Mention a channel)`)
					var collector2 = msg.channel.createCollector(
						m => msg.author.id == m.author.id,
						{ time: 60000 }
					);
					collector2.on('message', m => {
						if (m.mentions.channels.array()[0]) {
							m.channel.send(`${setting} set to ${bot.setNewValue(setting, m.guild.id, m.mentions.channels.array()[0].id)}!`)
							collector2.stop();
						}
						else
							m.channel.send(`Please mention a channel!`)
					});
					collector2.on('end', collected => {
						if (collected.size == 0)
							msg.channel.send("No messages were detected within 60 seconds. Aborting...")
						console.log(`Collected ${collected.size} items`)
					});
				}
			});
			collector.on('end', collected => {
				if (collected.size == 0)
					msg.channel.send("No messages were detected within 30 seconds. Aborting...")
				console.log(`Collected ${collected.size} items`)
			});
		}

		function setJoinRole(value) {
			msg.channel.send(`The current join role for this server is **${value}**. Do you want to change it? (Reply with 'yes' or 'no')`);
			var collector = msg.channel.createCollector(
				m => (m.content.toLowerCase() == 'yes' || m.content.toLowerCase() == 'no'),
				{ time: 30000 }
			);
			collector.on('collect', m => {
				var e = false;
				if (m.content.toLowerCase() == 'yes' && m.author.id == msg.author.id) {
					e = true
					collector.stop();
				} else if (m.content.toLowerCase() == 'no' && m.author.id == msg.author.id) {
					msg.channel.send(`The join role will remain as **${value}**.`)
					collector.stop();
				}
				if (e) {
					msg.channel.send("What would you like the join role to be? (Say the name of a role, 'NONE' for none)")
					var collector2 = msg.channel.createCollector(
						m => msg.author.id == m.author.id,
						{ time: 60000 }
					);
					collector2.on('message', m => {
						if (m.guild.roles.find('name', m.content)) {
							m.channel.send(`Join role set to ${bot.setJoinRole(m.guild.id, m.guild.roles.find('name', m.content).id)}!`)
							collector2.stop();
						} else if (m.content.toLowerCase() == "none") {
							bot.setJoinRole(m.guild.id, "NONE")
							m.channel.send(`Join role has been turned off!`)
							collector2.stop();
						}
						else
							m.channel.send(`Please say the name of a valid role or NONE!`)
					});
					collector2.on('end', collected => {
						if (collected.size == 0)
							msg.channel.send("No messages were detected within 60 seconds. Aborting...")
						console.log(`Collected ${collected.size} items`)
					});
				}
			});
			collector.on('end', collected => {
				if (collected.size == 0)
					msg.channel.send("No messages were detected within 30 seconds. Aborting...")
				console.log(`Collected ${collected.size} items`)
			});
		}
	}
};