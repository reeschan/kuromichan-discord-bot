/**
 * The core server that runs on a Cloudflare worker.
 */

import { AutoRouter } from 'itty-router';
import { InteractionResponseType, InteractionType, verifyKey } from 'discord-interactions';
import { CommnadType } from './register/commands';
import { JsonResponse } from './types';
import OpenAI from 'openai';
import openai from 'openai';

const router = AutoRouter();

/**
 * A simple :wave: hello page to verify the worker is working.
 */
router.get('/', (request: Request, env: any) => {
	return new Response(`👋 ${env.DISCORD_APPLICATION_ID}`);
});

const openAiClient = new OpenAI({
	apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

/**
 * Main route for all requests sent from Discord.  All incoming messages will
 * include a JSON payload described here:
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object
 */
router.post('/', async (request: Request, env: any): Promise<Response> => {
	const { isValid, interaction } = await server.verifyDiscordRequest(request, env);
	if (!isValid || !interaction) {
		return new Response('Bad request signature.', { status: 401 });
	}

	if (interaction.type === InteractionType.PING) {
		// The `PING` message is used during the initial webhook handshake, and is
		// required to configure the webhook in the developer portal.
		return new JsonResponse({
			type: InteractionResponseType.PONG,
		});
	}

	if (interaction.type === InteractionType.APPLICATION_COMMAND) {
		// Most user commands will come as `APPLICATION_COMMAND`.
		switch (interaction.data.name.toLowerCase()) {
			case CommnadType.DELETE_POST_REGISTER: {
				console.log(interaction);
				// kvにguildId, channnelId, interaction.data.options[0].valueを保存
				try {
				} catch (error) {
					console.error(error);
				}

				const DELETE_POST_MAP: KVNamespace = env.DELETE_POST_MAP;
				await DELETE_POST_MAP.put(
					interaction.guild_id,
					JSON.stringify({ channel_id: interaction.channel_id, time: interaction.data.options[0].value })
				);

				return new JsonResponse({
					type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
					data: {
						content: '登録したよ!',
					},
				});
			}
			case CommnadType.HELLO: {
				return new JsonResponse({
					type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
					data: {
						content: 'クロミちゃんかわいいいいいいい！',
					},
				});
			}
			case CommnadType.MODELING_SUGGESTER: {
				const level = interaction.data.options[0].value ?? Math.random() * 5;
				const genre = interaction.data.options[1].value ?? 'なんでも';
				const model = interaction.data.options[2].value ?? 'gpt-4o-mini';

				const command = `
					#命令
				
					あなたは一流のモデラーです。後輩にお題を出してモデリングしてもらいます。
				
					#条件：
				
					モデリング対象のみを5つ候補としてカンマ区切りで提示してください。
				
					#入力文：
					
					お題のレベルとジャンルを指定する。
				
					#出力文：
					モデリング対象のみを5つ候補としてカンマ区切りで提示。
				`;

				// openaiにリクエストを送信
				const completion = await openAiClient.chat.completions.create({
					model: model,
					messages: [
						{ role: 'system', content: command }, // 修正箇所
						{
							role: 'user',
							content: `今回のお題の難しさはレベル5段階中「${level}」でジャンルは「${genre}」として、お題を考えてください。`,
						},
					],
				});

				return new JsonResponse({
					type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
					data: {
						content: completion.choices[0].message.content,
					},
				});
			}
			default:
				return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
		}
	}

	console.error('Unknown Type');
	return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
});

router.all('*', () => new Response('Not Found.', { status: 404 }));

async function verifyDiscordRequest(request: Request, env: any) {
	const signature = request.headers.get('x-signature-ed25519');
	const timestamp = request.headers.get('x-signature-timestamp');
	const body = await request.text();
	const isValidRequest = signature && timestamp && (await verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY));
	if (!isValidRequest) {
		return { isValid: false };
	}

	return { interaction: JSON.parse(body), isValid: true };
}

const server = {
	verifyDiscordRequest,
	fetch: router.fetch,
};

export default server;
