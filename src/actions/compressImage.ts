import { JsonResponse } from '../types';
import { InteractionResponseType } from 'discord-interactions';

export async function compressImage(interaction: any, env: Env) {
	const attachmentId = Object.keys(interaction.data.resolved.attachments)[0];
	const attachment = interaction.data.resolved.attachments[attachmentId];
	const imageUrl = attachment.url;
	const imageResponse = await fetch(imageUrl);
	const imageArrayBuffer = await imageResponse.arrayBuffer();
	const base64Image = Buffer.from(imageArrayBuffer).toString('base64');
	const quality = interaction.data?.options?.[1]?.value ?? 80 * 1000;
	try {
		const result = await env.COMPRESS_IMAGE.compressImage(base64Image, quality);
		// Base64でもとにかく返すんだよ！！！！！！！！！！！ｗｗｗｗｗ discordはbase64でurl添付できないから・・・
		return new JsonResponse({
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: { content: result },
		});
	} catch (error) {
		console.log(error);
	}
}
