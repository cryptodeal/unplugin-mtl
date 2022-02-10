import init from './offscreenDemo';

const ctx: Worker = self as any;

self.onmessage = function (message) {
	const data = message.data;
	init(data.drawingSurface, data.width, data.height, data.pixelRatio, data.path);
};
