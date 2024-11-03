import { WorkerEntrypoint } from 'cloudflare:workers';
import { compress_image } from './external/wasm/compress-image';

export default class extends WorkerEntrypoint {
	async fetch() {
		return new Response('Hello from compresser');
	}

	async compressImage(image: string, size: number): Promise<string> {
		return new Promise((resolve, reject) => {
			try {
				resolve(compress_image(image, size));
			} catch (error) {
				reject(error);
			}
		});
	}
}
