import { WorkerEntrypoint } from 'cloudflare:workers';
import init, { compress_image } from './external/wasm/image_compresser';

export class ImageCompresser extends WorkerEntrypoint {
	async compressImage(image: string, size: number): Promise<string> {
		await init();
		return new Promise((resolve, reject) => {
			try {
				console.log(`Compressing image with size: ${size}`);
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
