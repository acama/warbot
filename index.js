const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const { Sequelize } = require('sequelize');
const challenges = require('./wargame/challenges.json')

const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: 'wargame/wargame.db'
});

/* Load the Models */
const Player = require(`${__dirname}/models/Player`)(sequelize);
const Challenge = require(`${__dirname}/models/Challenge`)(sequelize);
const Solve = require(`${__dirname}/models/Solve`)(sequelize);


/* Setup the challenges and flags */
async function setup_db() {
	await sequelize.sync();
	for (var k in challenges) {
		var chal = challenges[k];
		const [t, created] = await Challenge.findOrCreate({
			where: { title: chal.title },
			defaults:
				{ title: chal.title, body: chal.body, flag: chal.flag, url: chal.url, points: chal.points }
		});
		if (!created) {
			console.log("Challenge already in db, updating...");
			t.title = chal.title;
			t.body = chal.body;
			t.flag = chal.flag;
			t.url = chal.url;
			t.points = chal.points;
			t.save();
		}
	}

}
setup_db();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`)(sequelize);
	client.commands.set(command.data.name, command);
}

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);
