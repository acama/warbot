const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wghelp')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('HELP!');
	},
};
