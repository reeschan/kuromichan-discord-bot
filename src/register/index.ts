import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import { CommandList } from './commands'; // コマンドリストのインポート

// 環境変数の読み込み
const token = process.env.DISCORD_TOKEN;
const applicationId = process.env.DISCORD_APPLICATION_ID;

if (!token) {
	throw new Error('The DISCORD_TOKEN environment variable is required.');
}
if (!applicationId) {
	throw new Error('The DISCORD_APPLICATION_ID environment variable is required.');
}

// RESTクライアントを初期化
const rest = new REST({ version: '10' }).setToken(token);

// グローバルコマンドを登録する関数
async function registerGlobalCommands() {
	try {
		console.log('Started registering global application commands.');

		// DiscordのAPIにPUTリクエストを送信
		await rest.put(Routes.applicationCommands(applicationId!), { body: CommandList });

		console.log('Successfully registered all global application commands.');
	} catch (error) {
		console.error('Error registering global commands:', error);
	}
}

// コマンド登録の実行
registerGlobalCommands().catch((err) => {
	console.error('Failed to register commands:', err);
});
