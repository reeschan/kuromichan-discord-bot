import OpenAI from 'openai';

class OpenAIAction {
	private openAiClient: OpenAI;

	constructor(apiKey: string) {
		this.openAiClient = new OpenAI({
			apiKey: apiKey,
		});
	}

	/**
	 * Command generation method to dynamically create command text based on parameters.
	 */
	generateCommand(instruction: string, condition: string, input?: string, output?: string): string {
		return `
      #命令
      ${instruction}

      #条件：
      ${condition}

			#入力文：
			${input}

      #出力文：
      ${output}
    `;
	}

	async suggestModelingOptions(level: number, genre: string, model: string) {
		const command = this.generateCommand(
			'あなたは一流のモデラーです。後輩にお題を出してモデリングしてもらいます。',
			'モデリング対象のみを5つ候補としてカンマ区切りで提示してください。レベル5以上の場合は、この世の中に存在しない非常に難しいものを提示してください。',
			'お題のレベルとジャンルを指定する。',
			'モデリング対象のみを5つ候補としてカンマ区切りで提示。'
		);

		const completion = await this.openAiClient.chat.completions.create({
			model: model,
			messages: [
				{ role: 'system', content: command },
				{
					role: 'user',
					content: `今回のお題の難しさはレベル5段階中「${level}」でジャンルは「${genre}」として、お題を考えてください。`,
				},
			],
			stream: false,
		});

		return completion.choices[0].message.content;
	}

	async scoreModelingImage(base64Image: string, model: string, target?: string, prompt?: string) {
		const command = this.generateCommand(
			'あなたはAI画像評価者です。受け取った画像に対して、モデリングの精度を採点します。',
			'画像を基に対象物の正確性、質感、全体のバランスを考慮して評価を行ってください。\n\n 背景については考慮しないものとする。',
			'モデリングした名前の提示（無くとも可能)と画像のbase64を添付する',
			'評価点数とどうすればより高品質なものに出来上がるかを最大4行で箇条書きでアドバイスする。'
		);

		const getCompletion = async () => {
			return new Promise((resolve, reject) => {
				this.openAiClient.chat.completions
					.create({
						model: model,
						messages: [
							{ role: 'system', content: command },
							{
								role: 'user',
								content: [
									{
										type: 'text',
										text: `添付の画像${
											target ? `は${target}を対象としてモデリングをしています。これに` : 'に'
										}対して採点を行ってください。${prompt ? prompt : ''}`,
									},
									{
										type: 'image_url',
										image_url: {
											url: `data:image/jpeg;base64,${base64Image}`,
										},
									},
								],
							},
						],
						stream: false,
					})
					.then((response) => resolve(response.choices[0].message.content))
					.catch((error) => reject(error));
			});
		};

		// Promiseをawaitして結果を取得
		const completion = await getCompletion();
		return completion;
	}
}

export default OpenAIAction;
