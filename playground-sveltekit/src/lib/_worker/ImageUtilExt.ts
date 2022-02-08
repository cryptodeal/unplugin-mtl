import { Texture } from 'three';
export const loadTextureBinary = function (data, mapping, callback) {
	const image = new Image(),
		texture = new Texture(image, mapping);

	image.onload = function () {
		texture.needsUpdate = true;
		if (callback) callback(this);
	};
	image.crossOrigin = this.crossOrigin;
	image.src = 'data:image/png;base64,' + Base64.encode(data);

	return texture;
};
