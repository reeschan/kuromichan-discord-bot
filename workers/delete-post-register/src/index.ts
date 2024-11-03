import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { Message } from 'discord.js';

export default {
	async scheduled(request, env, ctx): Promise<void> {
		const token = env.DISCORD_TOKEN;
		const rest = new REST({ version: '10' }).setToken(token);

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
					const url = Routes.channelMessages(parsedData.channel_id);
					const messages = (await rest.get(url)) as Message[];

					console.log(messages);

					// 各メッセージのタイムスタンプを確認し、limitTimeを超えたメッセージを削除
					for (const message of messages) {
						const messageTime = new Date(message.createdTimestamp).getTime();

						if (messageTime + limitTime * 60 * 1000 < Date.now()) {
							// メッセージがlimitTimeより古い場合削除
							const deleteUrl = Routes.channelMessage(parsedData.channel_id, message.id);
							try {
								await rest.delete(deleteUrl);
								console.log(`Message ${message.id} deleted successfully.`);
							} catch (deleteError) {
								console.error(`Failed to delete message ${message.id}:`, deleteError);
							}
						}
					}
				}
			}
		} catch (error) {
			console.error('Error in message processing:', error);
		}
	},
} satisfies ExportedHandler<Env>;
