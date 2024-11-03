import { Client, GatewayIntentBits, TextChannel } from 'discord.js';

export default {
	async scheduled(request, env, ctx): Promise<void> {
		const token = env.DISCORD_TOKEN;

		// discord.jsクライアントを初期化
		const client = new Client({
			intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
		});

		client.once('ready', async () => {
			try {
				// KVストアから全データをリスト取得
				const registeredDataList = await env.DELETE_POST_MAP.list();

				// 各データに対して処理を実行
				for (const key of registeredDataList.keys) {
					const dataValue = await env.DELETE_POST_MAP.get(key.name);

					if (dataValue) {
						// データをJSONパースしてtimeフィールドを取得
						const parsedData = JSON.parse(dataValue);

						const limitTime = parsedData.time; // 格納されたタイムスタンプ (UNIX Time)

						// Discordのチャンネルからメッセージを取得
						const channel = (await client.channels.fetch(parsedData.channel_id)) as TextChannel;

						if (channel) {
							// チャンネルのメッセージを取得
							const messages = await channel.messages.fetch();

							// 各メッセージのタイムスタンプを確認し、limitTimeを超えたメッセージを削除
							for (const message of messages.values()) {
								const messageTime = message.createdTimestamp;

								if (messageTime + limitTime * 60 * 1000 < Date.now()) {
									// メッセージがlimitTimeより古い場合削除
									await message
										.delete()
										.then(() => console.log(`Message ${message.id} deleted successfully.`))
										.catch((error) => console.error(`Failed to delete message ${message.id}: ${error}`));
								}
							}
						} else {
							console.error(`Channel with ID ${parsedData.channel_id} not found.`);
						}
					}
				}
			} catch (error) {
				console.error('Error in message processing:', error);
			} finally {
				// 処理完了後、クライアントをログアウト
				client.destroy();
			}
		});

		// トークンでクライアントにログイン
		await client.login(token);
	},
} satisfies ExportedHandler<Env>;
