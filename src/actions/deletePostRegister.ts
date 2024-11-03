import { JsonResponse } from '../types';
import { InteractionResponseType } from 'discord-interactions';

export async function deletePostRegister(interaction: any, env: Env) {
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
