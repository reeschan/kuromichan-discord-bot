import { Hono, HonoRequest } from 'hono';
import { InteractionResponseType, InteractionType, verifyKey } from 'discord-interactions';
import { handleInteraction } from './action-handler';

type Interaction = {
	type: number;
	data?: { name: string };
};

const app = new Hono<{ Bindings: Env }>();

app.get('/', (c) => {
	return c.text(`👋 ${c.env.DISCORD_APPLICATION_ID}`);
});

app.post('/', async (c) => {
	const { isValid, interaction } = await verifyDiscordRequest(c.req, c.env);
	if (!isValid || !interaction) {
		return c.text('Bad request signature.', 401);
	}

	if (interaction.type === InteractionType.PING) {
		return c.json({ type: InteractionResponseType.PONG });
	}

	if (interaction.type === InteractionType.APPLICATION_COMMAND) {
		return await handleInteraction(interaction, c.env);
	}

	return c.json({ error: 'Unknown Type' }, 400);
});

app.all('*', (c) => c.text('Not Found.', 404));

async function verifyDiscordRequest(request: HonoRequest, env: Env): Promise<{ isValid: boolean; interaction?: Interaction }> {
	const signature = request.header('x-signature-ed25519');
	const timestamp = request.header('x-signature-timestamp');
	const body = await request.text();
	const isValidRequest = signature && timestamp && (await verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY));
	if (!isValidRequest) {
		return { isValid: false };
	}

	return { interaction: JSON.parse(body) as Interaction, isValid: true };
}

export default app;
