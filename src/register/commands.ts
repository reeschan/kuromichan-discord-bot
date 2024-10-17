import { DiscordApplicationCommand, DiscordApplicationCommandType } from '../types';
import { SlashCommandBuilder } from 'discord.js';

const aaa = new SlashCommandBuilder().setName('delete').setDescription('del;ete');

const DELETE_POST_REGISTER: DiscordApplicationCommand = {
	name: 'deletepostregister',
	type: DiscordApplicationCommandType.CAHT_INPUT,
	description: 'コマンドを打ったチャンネル内のチャットを〇seconds後に削除する',
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

export const CommandList = [DELETE_POST_REGISTER, HELLO, aaa];
