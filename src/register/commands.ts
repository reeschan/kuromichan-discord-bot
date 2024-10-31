import { DiscordApplicationCommand, DiscordApplicationCommandType } from '../types';

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

const MODELING_SUGGESTER: DiscordApplicationCommand = {
	name: 'modelingsuggester',
	type: DiscordApplicationCommandType.CAHT_INPUT,
	description: 'あなたにモデリングしてもらう対象を提案します。',
	options: [
		{
			name: 'レベル',
			type: 4,
			description: 'モデリングの難易度を1~5のintで指定(ない場合はランダム)',
			required: false,
		},
		{
			name: 'ジャンル',
			type: 3,
			description: 'モデリングのジャンルをstringで指定(ない場合はランダム)',
			required: false,
		},
		{
			name: 'モデル',
			type: 3,
			description: 'モデリングのモデルをstringで指定(ない場合はgpt-4o-mini)',
			required: false,
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
	MODELING_SUGGESTER: 'modelingsuggester',
} as const;

export type CommandType = (typeof CommnadType)[keyof typeof CommnadType];

export const CommandList = [DELETE_POST_REGISTER, HELLO, MODELING_SUGGESTER];
