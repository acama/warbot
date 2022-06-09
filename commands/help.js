const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = (sequelize) => {
	var dat = {
		data: new SlashCommandBuilder()
			.setName('help')
			.setDescription('Get the list of wargame commands'),
		async execute(interaction) {
			await interaction.reply('HELP!');
		},
	};
	return dat;
}

