// action-handler.ts
import { compressImage } from './actions/compressImage';
import { deletePostRegister } from './actions/deletePostRegister';
import { gameSuggester } from './actions/gameSuggester';
import { hello } from './actions/hello';
import { modelingScoring } from './actions/modelingScoring';
import { modelingSuggester } from './actions/modelingSuggester';
import { CommandType } from './register/commands';
import { JsonResponse } from './types';

export async function handleInteraction(interaction: any, env: any): Promise<Response> {
	// コマンドの処理
	switch (interaction.data.name.toLowerCase()) {
		case CommandType.DELETE_POST_REGISTER:
			return await deletePostRegister(interaction, env);
		case CommandType.HELLO:
			return hello();
		case CommandType.MODELING_SUGGESTER:
			return await modelingSuggester(interaction, env);
		case CommandType.MODELING_SCORING:
			return await modelingScoring(interaction, env);
		case CommandType.COMPRESS_IMAGE:
			return await compressImage(interaction, env);
		case CommandType.GAME_SUGGESTER:
			return await gameSuggester(interaction, env);
		default:
			return new JsonResponse({ error: 'Unknown command' }, { status: 400 });
	}
}
