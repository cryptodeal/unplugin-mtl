import type {
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
	SpriteMaterial
} from 'three';
import type { RestructureMaterialParams } from './types';

export const parseMaterial = (
	material:
		| LineBasicMaterial
		| LineDashedMaterial
		| Material
		| MeshBasicMaterial
		| MeshDepthMaterial
		| MeshDistanceMaterial
		| MeshLambertMaterial
		| MeshMatcapMaterial
		| MeshNormalMaterial
		| MeshPhongMaterial
		| MeshPhysicalMaterial
		| MeshStandardMaterial
		| MeshToonMaterial
		| PointsMaterial
		| RawShaderMaterial
		| ShaderMaterial
		| ShadowMaterial
		| SpriteMaterial
): RestructureMaterialParams => {
	const materialProps = {};
	switch (material.type) {
		case 'LineBasicMaterial':
			material as LineBasicMaterial;
			materialProps as RestructureMaterialParams;
			// code block
			break;

		case 'LineDashedMaterial':
			material as LineDashedMaterial;
			materialProps as RestructureMaterialParams;
			// code block
			break;

		case 'MeshBasicMaterial':
			material as MeshBasicMaterial;
			materialProps as RestructureMaterialParams;
			// code block
			break;

		case 'MeshDepthMaterial':
			material as MeshDepthMaterial;
			materialProps as RestructureMaterialParams;
			// code block
			break;

		case 'MeshDistanceMaterial':
			material as MeshDistanceMaterial;
			materialProps as RestructureMaterialParams;
			// code block
			break;

		case 'MeshLambertMaterial':
			material as MeshLambertMaterial;
			materialProps as RestructureMaterialParams;
			// code block
			break;

		case 'MeshMatcapMaterial':
			material as MeshMatcapMaterial;
			materialProps as RestructureMaterialParams;
			// code block
			break;

		case 'MeshNormalMaterial':
			material as MeshNormalMaterial;
			materialProps as RestructureMaterialParams;
			// code block
			break;

		case 'MeshPhongMaterial':
			material as MeshPhongMaterial;
			materialProps as RestructureMaterialParams;
			for (const key of Object.keys(material)) {
				materialProps[key as keyof RestructureMaterialParams] = material[key];
			}
			break;

		case 'MeshPhysicalMaterial':
			material as MeshPhysicalMaterial;
			materialProps as RestructureMaterialParams;
			// code block
			break;

		case 'MeshStandardMaterial':
			material as MeshStandardMaterial;
			materialProps as RestructureMaterialParams;
			// code block
			break;

		case 'MeshToonMaterial':
			material as MeshToonMaterial;
			materialProps as RestructureMaterialParams;
			// code block
			break;

		case 'PointsMaterial':
			material as MeshToonMaterial;
			materialProps as RestructureMaterialParams;
			// code block
			break;

		case 'RawShaderMaterial':
			material as RawShaderMaterial;
			materialProps as RestructureMaterialParams;
			// code block
			break;

		case 'ShaderMaterial':
			material as ShaderMaterial;
			materialProps as RestructureMaterialParams;
			// code block
			break;

		case 'ShadowMaterial':
			material as ShadowMaterial;
			materialProps as RestructureMaterialParams;
			// code block
			break;

		case 'SpriteMaterial':
			material as SpriteMaterial;
			materialProps as RestructureMaterialParams;
			// code block
			break;

		default:
			material as Material;
			materialProps as RestructureMaterialParams;
			// code block
			break;
	}
	return materialProps as RestructureMaterialParams;
};
