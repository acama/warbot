const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = (sequelize) => {
	var dat = {
		data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
		async execute(interaction) {
			await interaction.reply('PONG');
		},
	};
	return dat;
}

