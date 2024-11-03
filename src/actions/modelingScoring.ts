import { JsonResponse } from '../types';
import { InteractionResponseType } from 'discord-interactions';
import OpenAIAction from '../modules/openai-handler';

export async function modelingScoring(interaction: any, env: any) {
	const openAiAction = new OpenAIAction(env.OPENAI_API_KEY);
	try {
		const attachmentId = Object.keys(interaction.data.resolved.attachments)[0];
		const attachment = interaction.data.resolved.attachments[attachmentId];
		const imageUrl = attachment.url;
		const imageResponse = await fetch(imageUrl);
		const imageArrayBuffer = await imageResponse.arrayBuffer();
		const base64Image = Buffer.from(imageArrayBuffer).toString('base64');
		const moderingTarget = interaction.data?.options?.[1]?.value;
		const prompt = interaction.data?.options?.[2]?.value;
		const model = interaction.data?.options?.[3]?.value ?? 'gpt-4o-mini';

		const result = await openAiAction.scoreModelingImage(base64Image, model, moderingTarget, prompt);

		return new JsonResponse({
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: { content: result },
		});
	} catch (error) {
		console.error(error);
		return new JsonResponse({
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: { content: 'エラーが発生しました。' },
		});
	}
}
