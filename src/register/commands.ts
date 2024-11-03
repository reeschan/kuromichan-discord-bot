import { SlashCommandBuilder } from '@discordjs/builders';

const DELETE_POST_REGISTER = new SlashCommandBuilder()
	.setName('deletepostregister')
	.setDescription('コマンドを打ったチャンネル内のチャットを〇seconds後に削除する')
	.addIntegerOption((option) => option.setName('時間').setDescription('削除するまでの時間を時間（分）で指定').setRequired(true));

const MODELING_SUGGESTER = new SlashCommandBuilder()
	.setName('modelingsuggester')
	.setDescription('あなたにモデリングしてもらう対象を提案します。')
	.addIntegerOption((option) =>
		option.setName('レベル').setDescription('モデリングの難易度を1~5のintで指定(ない場合はランダム)').setRequired(false)
	)
	.addStringOption((option) =>
		option.setName('ジャンル').setDescription('モデリングのジャンルをstringで指定(ない場合はランダム)').setRequired(false)
	)
	.addStringOption((option) =>
		option.setName('モデル').setDescription('モデリングのモデルをstringで指定(ない場合はgpt-4o-mini)').setRequired(false)
	);

const MODELING_SCORING = new SlashCommandBuilder()
	.setName('modelingscoring')
	.setDescription('モデリング精度に関して、採点とアドバイスを提示します。')
	.addAttachmentOption((option) => option.setName('画像').setDescription('モデリングの画像を添付').setRequired(true))
	.addStringOption((option) => option.setName('モデリング対象').setDescription('モデリングの対象物を指定(オプション)').setRequired(false))
	.addStringOption((option) =>
		option
			.setName('補足プロンプト')
			.setDescription('モデリングのレビューに際して、どのような観点で見てほしいかを補足してください（オプション）')
			.setRequired(false)
	)
	.addStringOption((option) =>
		option.setName('モデル').setDescription('モデリングのモデルをstringで指定(ない場合はgpt-4o-mini)').setRequired(false)
	);

const HELLO = new SlashCommandBuilder().setName('hello').setDescription('挨拶を返す');

const COMPRESS_IMAGE = new SlashCommandBuilder()
	.setName('compressimage')
	.setDescription('画像を圧縮します。')
	.addAttachmentOption((option) => option.setName('画像').setDescription('圧縮する画像を添付').setRequired(true))
	.addIntegerOption((option) => option.setName('サイズ').setDescription('圧縮後のサイズ(KB)').setRequired(true));

export const CommandType = {
	DELETE_POST_REGISTER: 'deletepostregister',
	HELLO: 'hello',
	MODELING_SUGGESTER: 'modelingsuggester',
	MODELING_SCORING: 'modelingscoring',
	COMPRESS_IMAGE: 'compressimage',
} as const;

export type CommandType = (typeof CommandType)[keyof typeof CommandType];

export const CommandList = [
	DELETE_POST_REGISTER.toJSON(),
	MODELING_SUGGESTER.toJSON(),
	MODELING_SCORING.toJSON(),
	HELLO.toJSON(),
	COMPRESS_IMAGE.toJSON(),
] as const;
