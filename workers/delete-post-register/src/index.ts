export default {
	async scheduled(request, env, ctx): Promise<void> {
		const token = env.DISCORD_TOKEN;
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
					const url = `https://discord.com/api/v10/channels/${parsedData.channel_id}/messages`;
					const response = await fetch(url, {
						method: 'GET',
						headers: {
							Authorization: `Bot ${token}`,
							'Content-Type': 'application/json',
						},
					});

					if (response.ok) {
						const messages = await response.json();

						console.log(messages);

						// 各メッセージのタイムスタンプを確認し、limitTimeを超えたメッセージを削除
						for (const message of messages as unknown as any[]) {
							const messageTime = new Date(message.timestamp).getTime();

							if (messageTime + limitTime * 60 * 1000 < Date.now()) {
								// メッセージがlimitTimeより古い場合削除
								const deleteUrl = `https://discord.com/api/v10/channels/${parsedData.channel_id}/messages/${message.id}`;

								const deleteResponse = await fetch(deleteUrl, {
									method: 'DELETE',
									headers: {
										Authorization: `Bot ${token}`,
										'Content-Type': 'application/json',
									},
								});

								if (deleteResponse.ok) {
									console.log(`Message ${message.id} deleted successfully.`);
								} else {
									const errorText = await deleteResponse.text();
									console.error(`Failed to delete message ${message.id}: ${errorText}`);
								}
							}
						}
					} else {
						const errorText = await response.text();
						console.error(`Failed to fetch messages: ${errorText}`);
					}
				}
			}
		} catch (error) {
			console.error('Error in message processing:', error);
		}
	},
} satisfies ExportedHandler<Env>;
