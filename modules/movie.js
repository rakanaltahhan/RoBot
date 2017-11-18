const imdb = require('imdb-api');
var Discord = require('discord.js');

module.exports = {
	name: 'movie',
	usage: '<p>movie <movie-name>',
	permission: 1,
	help: 'Gets information about a movie.',
	main: function (bot, msg) {
		const opts = {
			apiKey: bot.config.imdb
		}
		imdb.get(msg.content, opts).then(d => {
			if (!d) {
				return msg.channel.send('No movies were found!');
			}
			var m = new Discord.RichEmbed()
			if (d.type == 'movie') {
				if (d.poster != "N/A")
					m.setThumbnail(d.poster)

				m.setTitle(`${d.title} (${d.year})`)
					.setDescription('Movie Information')
					.setURL(d.imdburl)
					.addField('Director', d.director, true)
					.addField('Producer', d.production, true)
					.addField('Writer(s)', d.writer.split(', ').join('\n') || 'None', true)
					.addField('Featuring', d.actors.split(', ').join('\n') || 'None', true)
					.addField('Release Date', new Date(d.released).toLocaleDateString('en-US'), true)
					.addField('Rated', d.rated, true)
					.addField('Genres', d.genres, true)
					.addField('Duration', d.runtime, true)
					.addField('Rating', d.rating + '/10', true)
					.addField('Votes', d.votes, true)
					.addField('Awards', d.awards || 'None', true)
					.setFooter('Powered by IMDB')
					.setTimestamp();
				
				if (d.plot.length > 1024 && d.plot.length < 2000) {
					m.addField('Description (1/2)', d.plot.substring(0, d.plot.indexOf(" ", 1010)) + "...")
					m.addField('Description (1/2)', "..." + d.plot.substring(d.plot.indexOf(" ", 1010) + 1, d.length))
				} else {
					m.addField('Description', d.plot)
				}
			}

			msg.channel.send({ embed: m });
		}).catch(console.log);
	}
};