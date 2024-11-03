import { REST, Routes } from 'discord.js';
import { CommandList } from './commands'; // コマンドリストのインポート

// 環境変数の読み込みとバリデーション
const token = process.env.DISCORD_TOKEN;
const applicationId = process.env.DISCORD_APPLICATION_ID;

if (!token || !applicationId) {
	throw new Error('The DISCORD_TOKEN and DISCORD_APPLICATION_ID environment variables are required.');
}

// RESTクライアントを初期化
const rest = new REST({ version: '10' }).setToken(token);

// グローバルコマンドを登録する関数
async function registerGlobalCommands() {
	try {
		console.log('Started registering global application commands.');

		// DiscordのAPIにPUTリクエストを送信してコマンドを登録
		const response = await rest.put(Routes.applicationCommands(applicationId!), { body: CommandList });

		console.log('Successfully registered all global application commands.');
		console.log('Response:', response);
	} catch (error) {
		console.error('Error registering global commands:', error);
	}
}

// コマンド登録の実行
registerGlobalCommands().catch((err) => {
	console.error('Failed to register commands:', err);
});
