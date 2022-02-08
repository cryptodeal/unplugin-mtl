import type {
	MTLWorkerMessageEventDataGeometry,
	RestructureMaterialParams,
	RestructureTextureParams
} from './types';
import {
	BufferAttribute,
	BufferGeometry,
	CanvasTexture,
	Color,
	LineBasicMaterial,
	LineDashedMaterial,
	Material,
	MeshBasicMaterial,
	MeshDepthMaterial,
	MeshDistanceMaterial,
	MeshLambertMaterial,
	MeshMatcapMaterial,
	MeshNormalMaterial,
	MeshPhongMaterial,
	MeshPhysicalMaterial,
	MeshStandardMaterial,
	MeshToonMaterial,
	PointsMaterial,
	RawShaderMaterial,
	ShaderMaterial,
	ShadowMaterial,
	SpriteMaterial,
	Texture,
	Vector2,
	Vector3
} from 'three';

import type {
	LineBasicMaterialParameters,
	LineDashedMaterialParameters,
	MaterialParameters,
	MeshBasicMaterialParameters,
	MeshDepthMaterialParameters,
	MeshDistanceMaterialParameters,
	MeshLambertMaterialParameters,
	MeshMatcapMaterialParameters,
	MeshNormalMaterialParameters,
	MeshPhongMaterialParameters,
	MeshPhysicalMaterialParameters,
	MeshStandardMaterialParameters,
	MeshToonMaterialParameters,
	PointsMaterialParameters,
	ShaderMaterialParameters,
	ShadowMaterialParameters,
	SpriteMaterialParameters
} from 'three';

export const restructureMaterial = (materialProps: RestructureMaterialParams) => {
	let resultingMaterial;

	switch (materialProps.type) {
		case 'LineBasicMaterial':
			materialProps as LineBasicMaterialParameters;
			resultingMaterial = new LineBasicMaterial(materialProps);
			break;

		case 'LineDashedMaterial':
			materialProps as LineDashedMaterialParameters;
			resultingMaterial = new LineDashedMaterial(materialProps);
			break;

		case 'MeshBasicMaterial':
			materialProps as MeshBasicMaterialParameters;
			resultingMaterial = new MeshBasicMaterial(materialProps);
			break;

		case 'MeshDepthMaterial':
			materialProps as MeshDepthMaterialParameters;
			resultingMaterial = new MeshDepthMaterial(materialProps);
			break;

		case 'MeshDistanceMaterial':
			materialProps as MeshDistanceMaterialParameters;
			resultingMaterial = new MeshDistanceMaterial(materialProps);
			break;

		case 'MeshLambertMaterial':
			materialProps as MeshLambertMaterialParameters;
			resultingMaterial = new MeshLambertMaterial(materialProps);
			break;

		case 'MeshMatcapMaterial':
			materialProps as MeshMatcapMaterialParameters;
			resultingMaterial = new MeshMatcapMaterial(materialProps);
			break;

		case 'MeshNormalMaterial':
			materialProps as MeshNormalMaterialParameters;
			resultingMaterial = new MeshNormalMaterial(materialProps);
			break;

		case 'MeshPhongMaterial': {
			materialProps as MeshPhongMaterialParameters;
			restructureHelpers(materialProps);
			resultingMaterial = new MeshPhongMaterial(materialProps);
			break;
		}
		case 'MeshPhysicalMaterial':
			materialProps as MeshPhysicalMaterialParameters;
			resultingMaterial = new MeshPhysicalMaterial(materialProps);
			break;

		case 'MeshStandardMaterial':
			materialProps as MeshStandardMaterialParameters;
			resultingMaterial = new MeshStandardMaterial(materialProps);
			break;

		case 'MeshToonMaterial':
			materialProps as MeshToonMaterialParameters;
			resultingMaterial = new MeshToonMaterial(materialProps);
			break;

		case 'PointsMaterial':
			materialProps as PointsMaterialParameters;
			resultingMaterial = new PointsMaterial(materialProps);
			break;

		case 'RawShaderMaterial':
			materialProps as ShaderMaterialParameters;
			resultingMaterial = new RawShaderMaterial(materialProps);
			break;

		case 'ShaderMaterial':
			materialProps as ShaderMaterialParameters;
			resultingMaterial = new ShaderMaterial(materialProps);
			break;

		case 'ShadowMaterial':
			materialProps as ShadowMaterialParameters;
			resultingMaterial = new ShadowMaterial(materialProps);
			break;

		case 'SpriteMaterial':
			materialProps as SpriteMaterialParameters;
			resultingMaterial = new SpriteMaterial(materialProps);
			break;

		default:
			materialProps as MaterialParameters;
			resultingMaterial = new Material();
			resultingMaterial.setValues(materialProps);
			break;
	}
	return resultingMaterial;
};

export const restructureGeometry = (
	geometry: MTLWorkerMessageEventDataGeometry
): BufferGeometry => {
	const resultingGeometry = new BufferGeometry();
	for (const key in geometry.attributes) {
		const { array, itemSize, normalized } = geometry.attributes[key];
		const attribute = new BufferAttribute(array, itemSize, normalized);
		resultingGeometry.setAttribute(key, attribute);
	}
	for (let i = 0; i < geometry.groups.length; i++) {
		const { start, count, materialIndex } = geometry.groups[i];
		resultingGeometry.addGroup(start, count, materialIndex);
	}
	return resultingGeometry;
};

export const restructureHelpers = (
	materialProps: RestructureMaterialParams
): RestructureMaterialParams => {
	for (const key in materialProps) {
		if (
			key.toLowerCase().includes('map') &&
			materialProps[key] !== null &&
			typeof materialProps[key] === 'object'
		) {
			const {
				image,
				mapping,
				wrapS,
				wrapT,
				magFilter,
				minFilter,
				format,
				type,
				anisotropy,
				encoding
			} = materialProps[key] as RestructureTextureParams;
			if (!image) {
				materialProps[key] = new CanvasTexture(
					image,
					mapping,
					wrapS,
					wrapT,
					magFilter,
					minFilter,
					format,
					type,
					anisotropy
				);
			} else {
				materialProps[key] = new Texture(
					image,
					mapping,
					wrapS,
					wrapT,
					magFilter,
					minFilter,
					format,
					type,
					anisotropy,
					encoding
				);
			}
		} else if (
			typeof materialProps[key]?.r === 'number' &&
			typeof materialProps[key]?.g === 'number' &&
			typeof materialProps[key]?.b === 'number'
		) {
			const { r, g, b } = materialProps[key];
			materialProps[key] = new Color(r, g, b);
		} else if (
			typeof materialProps[key]?.x === 'number' &&
			typeof materialProps[key]?.y === 'number' &&
			typeof materialProps[key]?.z === 'number'
		) {
			const { x, y, z } = materialProps[key];
			materialProps[key] = new Vector3(x, y, z);
		} else if (
			typeof materialProps[key]?.x === 'number' &&
			typeof materialProps[key]?.y === 'number'
		) {
			const { x, y } = materialProps[key];
			materialProps[key] = new Vector2(x, y);
		}
	}
	return materialProps;
};
