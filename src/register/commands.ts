import { DiscordApplicationCommand, DiscordApplicationCommandType, DiscordApplicationCommnadOptionType } from '../types';

const DELETE_POST_REGISTER: DiscordApplicationCommand = {
	name: 'deletepostregister',
	type: DiscordApplicationCommandType.CAHT_INPUT,
	description: 'コマンドを打ったチャンネル内のチャットを〇seconds後に削除する',
	options: [
		{
			name: '時間',
			type: 4,
			description: '削除するまでの時間を時間（分）で指定',
			required: true,
		},
	],
};

const HELLO: DiscordApplicationCommand = {
	name: 'hello',
	type: DiscordApplicationCommandType.CAHT_INPUT,
	description: '挨拶を返す',
};

export const CommnadType = {
	DELETE_POST_REGISTER: 'deletepostregister',
	HELLO: 'hello',
} as const;

export type CommandType = (typeof CommnadType)[keyof typeof CommnadType];

export const CommandList = [DELETE_POST_REGISTER, HELLO];
