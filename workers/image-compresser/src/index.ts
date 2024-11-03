import { WorkerEntrypoint } from 'cloudflare:workers';
import { compress_image } from './external/wasm/compress-image';

export class ImageCompresser extends WorkerEntrypoint {
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

export default {
	fetch() {
		return new Response('HelloRpc is Healthy!');
	},
};
