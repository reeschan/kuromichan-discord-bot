import { Client, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';

// 環境変数の読み込み
config();

// DiscordのBotトークンを環境変数から取得
const token = process.env.DISCORD_TOKEN;

if (!token) {
	throw new Error('The DISCORD_TOKEN environment variable is required.');
}

// 新しいDiscordクライアントを作成
const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

// ボットが起動した際の処理
client.once('ready', () => {
	console.log(`Logged in as ${client.user?.tag}!`);
});

// メッセージが送信されたときの処理
client.on('messageCreate', (message) => {
	// 自分自身のメッセージには反応しないようにする
	if (message.author.bot) return;

	// どんなメッセージでも「アタイはクロミだよっ！」と返信
	message.reply('アタイはクロミだよっ！');
});

// Discordにログイン
client.login(token);
