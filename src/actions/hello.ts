import { JsonResponse } from '../types';
import { InteractionResponseType } from 'discord-interactions';

export function hello() {
	return new JsonResponse({
		type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
		data: { content: 'クロミちゃんかわいいいいいいい！' },
	});
}
