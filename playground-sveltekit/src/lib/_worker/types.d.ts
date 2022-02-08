import type {
	BufferAttribute,
	InterleavedBufferAttribute,
	Texture,
	Blending,
	Plane,
	Color,
	Combine,
	DepthModes,
	BlendingDstFactor,
	BlendingEquation,
	NormalMapTypes,
	Vector2,
	Side,
	StencilOp,
	StencilFunc,
	PixelFormat,
	ColorRepresentation,
	DepthPackingStrategies,
	IUniform,
	GLSLVersion,
	TextureEncoding,
	TextureFilter,
	Mapping,
	Matrix3
} from 'three';

export interface MTLWorkerListenerEventData {
	mtl: string;
	path: string;
	obj: string;
}

export interface MTLWorkerListenerEvent extends MessageEvent {
	data: MTLWorkerListenerEventData;
}

export interface GeometryAttibuteData {
	[name: string]: BufferAttribute | InterleavedBufferAttribute;
}

export interface MTLWorkerMessageEventDataGeometry {
	attributes: {
		[name: string]: BufferAttribute | InterleavedBufferAttribute;
	};
	groups: {
		start: number;
		count: number;
		materialIndex?: number;
	}[];
}

export interface MTLWorkerMessageEventData {
	geometry: MTLWorkerMessageEventDataGeometry;
	material?: RestructureMaterialParams[];
}

export interface MTLWorkerMessageEvent extends MessageEvent {
	data: MTLWorkerMessageEventData;
}

type MaterialPrecision = 'highp' | 'mediump' | 'lowp';

type MaterialType =
	| 'LineBasicMaterial'
	| 'LineDashedMaterial'
	| 'Material'
	| 'MeshBasicMaterial'
	| 'MeshDepthMaterial'
	| 'MeshDistanceMaterial'
	| 'MeshLambertMaterial'
	| 'MeshMatcapMaterial'
	| 'MeshNormalMaterial'
	| 'MeshPhongMaterial'
	| 'MeshPhysicalMaterial'
	| 'MeshStandardMaterial'
	| 'MeshToonMaterial'
	| 'PointsMaterial'
	| 'RawShaderMaterial'
	| 'ShaderMaterial'
	| 'ShadowMaterial'
	| 'SpriteMaterial';

type MaterialLinecap = 'butt' | 'round' | 'square';

type MaterialLinejoin = 'round' | 'bevel' | 'miter';

export interface RestructureTextureParams {
	anisotropy?: number;
	center?: Vector2;
	encoding?: TextureEncoding;
	flipY?: boolean;
	format?: PixelFormat;
	generateMipmaps?: boolean;
	image?: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | null;
	internalFormat?: PixelFormatGPU | null;
	isRenderTargetTexture?: boolean;
	magFilter?: TextureFilter; // default THREE.LinearFilter
	mapping?: Mapping; // default THREE.Texture.DEFAULT_MAPPING
	matrix?: Matrix3; // default new THREE.Matrix3()
	matrixAutoUpdate?: boolean; // default true
	minFilter?: TextureFilter; // default THREE.LinearMipmapLinearFilter
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	mipmaps: any[]; // ImageData[] for 2D textures and CubeTexture[] for cube textures;
	name: string; // default ''
	needsPMREMUpdate?: boolean;
	offset?: Vector2; // default new THREE.Vector2( 0, 0 )
	premultiplyAlpha?: boolean; // default false
	repeat?: Vector2; // default new THREE.Vector2( 1, 1 )
	rotation?: number;
	type?: TextureDataType; // default THREE.UnsignedByteType
	unpackAlignment?: number; // default 4
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	userData?: any; // default any
	wrapS?: Wrapping; // default THREE.ClampToEdgeWrapping
	wrapT?: Wrapping; // default THREE.ClampToEdgeWrapping
}

export interface RestructureMaterialParams {
	attenuationDistance?: number;
	attenuationColor?: Color;
	alphaMap?: null | Texture; // default null
	alphaTest?: number | undefined;
	alphaToCoverage?: boolean; // default false
	aoMap?: null | Texture; // default null when required
	aoMapIntensity?: number; // default 1
	blendDst?: BlendingDstFactor;
	blendDstAlpha?: null | number; // default null when required
	blendEquation?: BlendingEquation; // default AddEquation
	blendEquationAlpha?: null | number; // default null when required
	blending?: Blending; // default NormalBlending
	blendSrc?: BlendingSrcFactor | BlendingDstFactor; // default SrcAlphaFactor
	blendSrcAlpha?: null | number; // default null when required
	bumpMap?: null | Texture; // default null for MeshPhongMaterial
	bumpScale?: number; // default 1
	clearcoat?: number;
	clearcoatMap?: null | Texture; // default null when required
	clearcoatRoughness?: number;
	clearcoatRoughnessMap?: null | Texture; // default null when required
	clearcoatNormalScale?: Vector2;
	clearcoatNormalMap?: null | Texture; // default null when required
	clipIntersection?: boolean; // default false when required
	clipping?: boolean;
	clippingPlanes?: null | Plane[]; // default null when required
	clipShadows?: boolean; // default false
	color?: Color | ColorRepresentation; // default new Color( 0xffffff ) when required
	colorWrite?: boolean; // default true when required
	combine?: Combine; // default MultiplyOperation
	dashSize?: number; // default 3 when required
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	defines?: any;
	depthFunc?: DepthModes; // default LessEqualDepth
	depthPacking?: DepthPackingStrategies;
	depthTest?: boolean; // default true
	depthWrite?: boolean; // default true
	displacementBias?: number; // default is 0
	displacementMap?: null | Texture; // default null
	displacementScale?: number; // default 1
	dithering?: boolean; // default false
	emissive?: Color | ColorRepresentation; // default black when required
	emissiveIntensity?: number; // default 1
	emissiveMap?: null | Texture; // default null when required
	envMap?: null | Texture; // default null when required
	envMapIntensity?: number; // default 1
	extensions?: {
		derivatives?: boolean;
		fragDepth?: boolean;
		drawBuffers?: boolean;
		shaderTextureLOD?: boolean;
	};
	farDistance?: number;
	fragmentShader?: string;
	nearDistance?: number;
	flatShading?: boolean; // default false when required
	fog?: boolean; // default true when required
	format?: PixelFormat;
	gapSize?: number; // default 1 when required
	glslVersion?: GLSLVersion;
	gradientMap?: null | Texture; // default null when required
	ior?: number;
	lightMap?: null | Texture; // default null when required
	lightMapIntensity?: number; // default 1 when required
	lights?: boolean;
	linewidth?: number; // default 1
	linecap?: MaterialLinecap;
	linejoin?: MaterialLinejoin;
	map?: null | Texture; // default null when required
	matcap?: null | Texture; // default null when required
	metalness?: number;
	metalnessMap?: null | Texture; // default null when required
	name?: string; // default ''
	normalMap?: null | Texture; // default null when required
	normalMapType?: NormalMapTypes; // default TangentSpaceNormalMap
	normalScale?: Vector2; // default new Vector2( 1, 1 )
	opacity?: number; // default 1.0
	polygonOffset?: boolean; // default false
	polygonOffsetFactor?: number; // default 0
	polygonOffsetUnits?: number; // default 0
	precision?: null | MaterialPrecision; // default null
	premultipliedAlpha?: boolean; // default false when required
	referencePosition?: Vector3;
	reflectivity?: number; // default 1.0; range 0.0 - 1.0
	refractionRatio?: number; // default 0.98; index of refraction of air / index of refraction of material
	rotation?: number;
	roughness?: number;
	roughnessMap?: null | Texture; // default null when required
	scale?: number; // default 1 when required
	sheen?: number;
	sheenColor?: Color;
	sheenRoughness?: number;
	side?: Side; // default FrontSide
	size?: number;
	sizeAttenuation?: boolean;
	shadowSide?: null | Side; // default null when required
	shininess?: number; // default 30
	specular?: Color; // default new Color( 0x111111 )
	specularMap?: null | Texture; // default null
	specularIntensity?: number;
	specularIntensityMap?: null | Texture;
	specularColor?: Color;
	specularColorMap?: null | Texture;
	stencilFail?: StencilOp; // default KeepStencilOp
	stencilFunc?: StencilFunc; // default AlwaysStencilFunc
	stencilFuncMask?: number; // default 0xFF when required
	stencilRef?: number; // default 0 when required
	stencilWrite?: boolean; // default false
	stencilWriteMask?: number; // default 0xFF
	stencilZFail?: StencilOp; // default KeepStencilOp
	stencilZPass?: StencilOp; // default KeepStencilOp
	toneMapped?: boolean; // default true when required
	transmission?: number;
	transmissionMap?: null | Texture; // default null when required
	transparent?: boolean; // default false
	type: MaterialType; // default to type of material of the object
	uniforms?: { [uniform: string]: IUniform };
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	userData?: any; // default any
	vertexColors?: boolean; // default false when required
	vertexShader?: string;
	visible?: boolean; // default true
	wireframe?: boolean; // default false
	wireframeLinecap?: MaterialLinecap; // default 'round'
	wireframeLinejoin?: MaterialLinejoin; // default 'round'
	wireframeLinewidth?: number; // default 1
}
