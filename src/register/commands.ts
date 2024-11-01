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

const MODELING_SCORING: DiscordApplicationCommand = {
	name: 'modelingscoring',
	type: DiscordApplicationCommandType.CAHT_INPUT,
	description: 'モデリング精度に関して、採点とアドバイスを提示します。',
	options: [
		{
			name: '画像',
			type: 11,
			description: 'モデリングの画像を添付',
			required: true,
		},
		{
			name: 'モデリング対象',
			type: 3,
			description: 'モデリングの対象物を指定(オプション)',
			required: false,
		},
		{
			name: '補足プロンプト',
			type: 3,
			description: 'モデリングのレビューに際して、どのような観点で見てほしいかを補足してください（オプション）',
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
	MODELING_SCORING: 'modelingscoring',
} as const;

export type CommandType = (typeof CommnadType)[keyof typeof CommnadType];

export const CommandList = [DELETE_POST_REGISTER, HELLO, MODELING_SUGGESTER, MODELING_SCORING] as const;
