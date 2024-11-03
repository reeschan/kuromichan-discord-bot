import { JsonResponse } from '../types';
import { InteractionResponseType } from 'discord-interactions';
import OpenAIAction from '../modules/openai-handler';

export async function modelingSuggester(interaction: any, env: Env) {
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
