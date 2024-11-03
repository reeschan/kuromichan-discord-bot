export class JsonResponse extends Response {
	constructor(body: any, init?: ResponseInit) {
		const jsonBody = JSON.stringify(body);
		init = init || {
			headers: {
				'content-type': 'application/json;charset=UTF-8',
			},
		};
		super(jsonBody, init);
	}
}

export enum DiscordApplicationCommandType {
	CAHT_INPUT = 1,
}

export enum DiscordApplicationCommnadOptionType {
	SUB_COMMAND = 1,
}

type DiscordApplicationCommandOption = {
	type: keyof [DiscordApplicationCommnadOptionType];
	name: string;
	description: string;
	required?: boolean;
};

export type DiscordApplicationCommand = {
	type: keyof [DiscordApplicationCommandType];
	application_id?: number;
	guild_id?: number;
	name: string;
	description: string;
	options?: DiscordApplicationCommandOption[];
};

export type DiscordMessage = {
	id: string;
	timestamp: string;
};
