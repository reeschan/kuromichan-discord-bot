/**
 * The core server that runs on a Cloudflare worker.
 */

import { AutoRouter } from 'itty-router';
import { InteractionResponseType, InteractionType, verifyKey } from 'discord-interactions';
import { CommnadType } from './register/commands';
import { JsonResponse } from './types';
import OpenAIAction from './actions/openai-action';

const router = AutoRouter();

/**
 * A simple :wave: hello page to verify the worker is working.
 */
router.get('/', (request: Request, env: any) => {
	return new Response(`👋 ${env.DISCORD_APPLICATION_ID}`);
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
		return new JsonResponse({
			type: InteractionResponseType.PONG,
		});
	}

	if (interaction.type === InteractionType.APPLICATION_COMMAND) {
		switch (interaction.data.name.toLowerCase()) {
			case CommnadType.DELETE_POST_REGISTER: {
				const DELETE_POST_MAP: KVNamespace = env.DELETE_POST_MAP;
				await DELETE_POST_MAP.put(
					interaction.guild_id,
					JSON.stringify({ channel_id: interaction.channel_id, time: interaction.data.options[0].value })
				);
				return new JsonResponse({
					type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
					data: { content: '登録したよ!' },
				});
			}
			case CommnadType.HELLO: {
				return new JsonResponse({
					type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
					data: { content: 'クロミちゃんかわいいいいいいい！' },
				});
			}
			case CommnadType.MODELING_SUGGESTER: {
				const openAiAction = new OpenAIAction(env.OPENAI_API_KEY);
				const level = interaction.data?.options?.[0]?.value ?? Math.random() * 5;
				const genre = interaction.data?.options?.[1]?.value ?? 'なんでも';
				const model = interaction.data?.options?.[2]?.value ?? 'gpt-4o-mini';

				const result = await openAiAction.suggestModelingOptions(level, genre, model);

				return new JsonResponse({
					type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
					data: { content: result },
				});
			}
			case CommnadType.MODELING_SCORING: {
				const openAiAction = new OpenAIAction(env.OPENAI_API_KEY);
				try {
					// 添付画像を取得してbase64に変換
					const attachmentId = interaction.data?.resolved?.attachments ? Object.keys(interaction.data.resolved.attachments)[0] : null;

					if (!attachmentId) {
						return new JsonResponse({
							type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
							data: { content: '画像が添付されていません。' },
						});
					}

					const attachment = interaction.data.resolved.attachments[attachmentId];
					const imageUrl = attachment.url;
					const imageResponse = await fetch(imageUrl);
					const imageArrayBuffer = await imageResponse.arrayBuffer();
					const base64Image = Buffer.from(imageArrayBuffer).toString('base64');
					const moderingTarget = interaction.data?.options?.[1]?.value;
					const prompt = interaction.data?.options?.[2]?.value;
					const model = interaction.data?.options?.[3]?.value ?? 'gpt-4o-mini';

					const score = await openAiAction.scoreModelingImage(base64Image, model, moderingTarget, prompt);

					return new JsonResponse({
						type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
						data: { content: `この画像のスコアは ${score} です。` },
					});
				} catch (error) {
					console.error(error);
					return new JsonResponse({
						type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
						data: { content: 'エラーが発生しました。' },
					});
				}
			}
			default:
				return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
		}
	}

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
