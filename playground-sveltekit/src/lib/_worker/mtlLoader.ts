import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import type {
	MTLWorkerListenerEvent,
	MTLWorkerMessageEventData,
	RestructureMaterialParams
} from './types';
import { Mesh, BufferGeometry, Material } from 'three';
import type { MTLLoader as mtlLoaderType } from 'three/examples/jsm/loaders/MTLLoader.js';
import { MTLLoader } from '$lib/_worker/loadMtl';

import { parseMaterial } from './parseMaterial';
const ctx: Worker = self as any;

// We send a message back to the main thread
ctx.addEventListener('message', (event: MTLWorkerListenerEvent) => {
	const mtlLoader = new MTLLoader();
	const { mtl, path, obj } = event.data;
	const matches = mtl.match(/ (.*\.(jpeg|jpg|mpc|mps|mpb|cxc|cxs|cxb|png|tga))/g);
	if (!matches) {
		const materials = mtlLoader.parse(mtl, path) as unknown as mtlLoaderType.MaterialCreator;
		materials.preload();
		const resultingObject = new OBJLoader().setMaterials(materials).parse(obj);
		console.log('resultingObject child count:', resultingObject.children.length);
		const children = [];
		resultingObject.children.map((child) => {
			if (child instanceof Mesh) {
				const {
					geometry,
					material
				}: { geometry: BufferGeometry | undefined; material: Material | undefined } = child;
				console.log('web worker material:', material);
				console.log('web worker geometry:', geometry);

				const parsedMaterials: RestructureMaterialParams[] = [];
				if (Array.isArray(material)) {
					material.forEach((m) => {
						parsedMaterials.push(parseMaterial(m));
					});
				} else {
					parsedMaterials.push(parseMaterial(material));
				}
				const parsedGeometry = {
					attributes: geometry.attributes,
					groups: geometry.groups
				};
				// Send the material back to the main thread
				const message: MTLWorkerMessageEventData = {
					geometry: parsedGeometry,
					material: parsedMaterials
				};
				ctx.postMessage(message);
			}
		});
	} else {
		const materials = mtlLoader.parse(mtl, path) as unknown as mtlLoaderType.MaterialCreator;
		materials.preload();
		const resultingObject = new OBJLoader().setMaterials(materials).parse(obj);
		console.log('resultingObject child count:', resultingObject.children.length);
		resultingObject.children.map((child) => {
			if (child instanceof Mesh) {
				const {
					geometry,
					material
				}: { geometry: BufferGeometry | undefined; material: Material | undefined } = child;
				console.log('web worker material:', material);
				console.log('web worker geometry:', geometry);

				const parsedMaterials: RestructureMaterialParams[] = [];
				if (Array.isArray(material)) {
					material.forEach((m) => {
						parsedMaterials.push(parseMaterial(m));
					});
				} else {
					parsedMaterials.push(parseMaterial(material));
				}
				const parsedGeometry = {
					attributes: geometry.attributes,
					groups: geometry.groups
				};
				// Send the material back to the main thread
				const message: MTLWorkerMessageEventData = {
					geometry: parsedGeometry,
					material: parsedMaterials
				};
				ctx.postMessage(message);
			}
		});
	}
});
