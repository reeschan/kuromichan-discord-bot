// action-handler.ts
import { deletePostRegister } from './actions/deletePostRegister';
import { hello } from './actions/hello';
import { modelingScoring } from './actions/modelingScoring';
import { modelingSuggester } from './actions/modelingSuggester';
import { CommandType } from './register/commands';
import { JsonResponse } from './types';

export async function handleInteraction(interaction: any, env: any): Promise<Response> {
	// コマンドの処理
	switch (interaction.commandName.toLowerCase()) {
		case CommandType.DELETE_POST_REGISTER:
			return await deletePostRegister(interaction, env);
		case CommandType.HELLO:
			return hello();
		case CommandType.MODELING_SUGGESTER:
			return await modelingSuggester(interaction, env);
		case CommandType.MODELING_SCORING:
			return await modelingScoring(interaction, env);
		default:
			return new JsonResponse({ error: 'Unknown command' }, { status: 400 });
	}
}
