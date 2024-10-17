/**
 * The core server that runs on a Cloudflare worker.
 */

import { AutoRouter } from 'itty-router';
import { InteractionResponseType, InteractionType, verifyKey, InteractionResponseFlags } from 'discord-interactions';
import { CommnadType } from './register/commands';
import { JsonResponse } from './types';

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
				return new JsonResponse({
					type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
					data: {
						content: 'https://cdn.discordapp.com/attachments/891978000000000000/891978000000000000/awww.gif',
					},
				});
			}
			case CommnadType.HELLO: {
				const applicationId = env.DISCORD_APPLICATION_ID;
				return new JsonResponse({
					type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
					data: {
						content: 'アタイはクロミだよっ！',
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
