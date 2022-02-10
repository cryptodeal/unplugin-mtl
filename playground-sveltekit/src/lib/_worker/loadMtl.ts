import {
	Color,
	DefaultLoadingManager,
	FileLoader,
	FrontSide,
	Loader,
	LoaderUtils,
	MeshPhongMaterial,
	RepeatWrapping,
	Vector2,
	sRGBEncoding,
	TextureLoader,
	DataTexture
} from 'three';
import type {
	LoadingManager,
	Material,
	Side,
	Wrapping,
	Mapping,
	MeshPhongMaterialParameters
} from 'three';

export interface MaterialCreatorOptions {
	/**
	 * side: Which side to apply the material
	 * THREE.FrontSide (default), THREE.BackSide, THREE.DoubleSide
	 */
	side?: Side | undefined;
	/*
	 * wrap: What type of wrapping to apply for textures
	 * THREE.RepeatWrapping (default), THREE.ClampToEdgeWrapping, THREE.MirroredRepeatWrapping
	 */
	wrap?: Wrapping | undefined;
	/*
	 * normalizeRGB: RGBs need to be normalized to 0-1 from 0-255
	 * Default: false, assumed to be already normalized
	 */
	normalizeRGB?: boolean | undefined;
	/*
	 * ignoreZeroRGBs: Ignore values of RGBs (Ka,Kd,Ks) that are all 0's
	 * Default: false
	 */
	ignoreZeroRGBs?: boolean | undefined;
	/*
	 * invertTrProperty: Use values 1 of Tr field for fully opaque. This option is useful for obj
	 * exported from 3ds MAX, vcglib or meshlab.
	 * Default: false
	 */
	invertTrProperty?: boolean | undefined;
}

export interface MaterialInfo {
	ks?: number[] | undefined;
	kd?: number[] | undefined;
	ke?: number[] | undefined;
	map_kd?: string | undefined;
	map_ks?: string | undefined;
	map_ke?: string | undefined;
	norm?: string | undefined;
	map_bump?: string | undefined;
	bump?: string | undefined;
	map_d?: string | undefined;
	ns?: number | undefined;
	d?: number | undefined;
	tr?: number | undefined;
}

export interface TexParams {
	scale: Vector2;
	offset: Vector2;
	url: string;
}

/**
 * Loads a Wavefront .mtl file specifying materials
 */

class MTLLoader extends Loader {
	public materialOptions: MaterialCreatorOptions = {};
	public extRefHelpers: ExtRefData[];

	constructor(extRefHelpers?: ExtRefData[], manager?: LoadingManager) {
		super(manager);
		this.extRefHelpers = extRefHelpers || [];
	}
	/**
	 * Loads and parses a MTL asset from a URL.
	 *
	 * @param {String} url - URL to the MTL file.
	 * @param {Function} [onLoad] - Callback invoked with the loaded object.
	 * @param {Function} [onProgress] - Callback for download progress.
	 * @param {Function} [onError] - Callback for download errors.
	 *
	 * @see setPath setResourcePath
	 *
	 * @note In order for relative texture references to resolve correctly
	 * you must call setResourcePath() explicitly prior to load.
	 */
	load(
		url: string,
		onLoad: (materialCreator: MaterialCreator) => void,
		onProgress?: (event: ProgressEvent) => void,
		onError?: (event: ErrorEvent) => void
	) {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const scope = this;

		const path = this.path === '' ? LoaderUtils.extractUrlBase(url) : this.path;

		const loader = new FileLoader(this.manager);
		loader.setPath(this.path);
		loader.setRequestHeader(this.requestHeader);
		loader.setWithCredentials(this.withCredentials);
		loader.load(
			url,
			function (text) {
				try {
					if (typeof text !== 'string')
						throw Error(`Error: ${text} is ArrayBuffer; expected string`);
					onLoad(scope.parse(text, path));
				} catch (e) {
					if (onError) {
						onError(e as ErrorEvent);
					} else {
						console.error(e);
					}

					scope.manager.itemError(url);
				}
			},
			onProgress,
			onError
		);
	}

	setMaterialOptions(value: MaterialCreatorOptions) {
		this.materialOptions = value;
		return this;
	}

	parse(text: string, path: string): MaterialCreator {
		const lines = text.split('\n');
		let info: { [key: string]: string | [number, number, number] } = {};
		const delimiter_pattern = /\s+/;
		const materialsInfo: { [key: string]: MaterialInfo } = {};

		for (let i = 0; i < lines.length; i++) {
			let line = lines[i];
			line = line.trim();

			if (line.length === 0 || line.charAt(0) === '#') {
				// Blank line or comment ignore
				continue;
			}

			const pos = line.indexOf(' ');

			let key = pos >= 0 ? line.substring(0, pos) : line;
			key = key.toLowerCase();

			let value = pos >= 0 ? line.substring(pos + 1) : '';
			value = value.trim();

			if (key === 'newmtl') {
				// New material

				info = { name: value };
				materialsInfo[value] = info;
			} else {
				if (key === 'ka' || key === 'kd' || key === 'ks' || key === 'ke') {
					const ss = value.split(delimiter_pattern, 3);
					info[key] = [parseFloat(ss[0]), parseFloat(ss[1]), parseFloat(ss[2])];
				} else {
					info[key] = value;
				}
			}
		}

		const materialCreator = new MaterialCreator(
			this.resourcePath || path,
			this.materialOptions,
			this.extRefHelpers
		);
		materialCreator.setCrossOrigin(this.crossOrigin);
		materialCreator.setManager(this.manager);
		materialCreator.setMaterials(materialsInfo);
		return materialCreator;
	}
}

export class MaterialCreator {
	public baseUrl: string;
	public options: MaterialCreatorOptions;
	public materialsInfo: { [key: string]: MaterialInfo } = {};
	public materials: { [key: string]: Material } = {};
	private materialsArray: Material[] = [];
	public nameLookup: { [key: string]: number } = {};
	public crossOrigin = 'anonymous';
	public side: Side;
	public wrap: Wrapping;
	public manager?: LoadingManager;
	public extRefHelpers: ExtRefData[];

	constructor(baseUrl = '', options?: MaterialCreatorOptions, extRefHelpers?: ExtRefData[]) {
		this.baseUrl = baseUrl;
		this.options = options;
		this.extRefHelpers = extRefHelpers || [];

		this.side = this.options?.side !== undefined ? this.options.side : FrontSide;
		this.wrap = this.options?.wrap !== undefined ? this.options.wrap : RepeatWrapping;
	}

	setCrossOrigin(value: string) {
		this.crossOrigin = value;
		return this;
	}

	setManager(value: LoadingManager) {
		this.manager = value;
	}

	setMaterials(materialsInfo: { [key: string]: MaterialInfo }) {
		this.materialsInfo = this.convert(materialsInfo);
		this.materials = {};
		this.materialsArray = [];
		this.nameLookup = {};
	}

	convert(materialsInfo: { [key: string]: MaterialInfo }) {
		if (!this.options) return materialsInfo;

		const converted: { [key: string]: MaterialInfo } = {};

		for (const mn in materialsInfo) {
			// Convert materials info into normalized form based on options

			// Below solution allows treating key of MaterialInfo as key, but is a bit hacky LOL
			const mat = materialsInfo[mn as keyof MaterialInfo];

			const covmat: { [key: string]: MaterialInfo } = {};

			converted[mn] = covmat;

			for (const prop in mat) {
				let save = true;
				let value = mat[prop as keyof MaterialInfo];
				const lprop = prop.toLowerCase();

				switch (lprop) {
					case 'kd':
					case 'ka':
					case 'ks':
						// Diffuse color (color under white light) using RGB values

						if (this.options && this.options.normalizeRGB && Array.isArray(value)) {
							value = [value[0] / 255, value[1] / 255, value[2] / 255];
						}

						if (this.options && this.options.ignoreZeroRGBs && Array.isArray(value)) {
							if (value[0] === 0 && value[1] === 0 && value[2] === 0) {
								// ignore

								save = false;
							}
						}

						break;

					default:
						break;
				}

				if (save) {
					covmat[lprop] = value as MaterialInfo;
				}
			}
		}

		return converted;
	}

	preload() {
		for (const mn in this.materialsInfo) {
			this.create(mn);
		}
	}

	getIndex(materialName: string) {
		return this.nameLookup[materialName];
	}

	getAsArray() {
		let index = 0;

		for (const mn in this.materialsInfo) {
			this.materialsArray[index] = this.create(mn);
			this.nameLookup[mn] = index;
			index++;
		}

		return this.materialsArray;
	}

	create(materialName: string) {
		if (this.materials[materialName] === undefined) {
			this.createMaterial_(materialName);
		}

		return this.materials[materialName];
	}

	createMaterial_(materialName: string) {
		// Create material

		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const scope = this;
		const mat = this.materialsInfo[materialName];
		const params: MeshPhongMaterialParameters = {
			name: materialName,
			side: this.side
		};
		function resolveURL(baseUrl: string, url: string) {
			if (typeof url !== 'string' || url === '') return '';

			// Absolute URL
			if (/^http?:\/\//i.test(url)) return url;

			return baseUrl + url;
		}

		function setMapForType(mapType: string, value: string) {
			if (params[mapType]) return; // Keep the first encountered texture

			const texParams: TexParams = scope.getTextureParams(value, params);
			const map = scope.loadTexture(resolveURL(scope.baseUrl, texParams.url));

			map.repeat.copy(texParams.scale);
			map.offset.copy(texParams.offset);

			map.wrapS = scope.wrap;
			map.wrapT = scope.wrap;

			if (mapType === 'map' || mapType === 'emissiveMap') {
				map.encoding = sRGBEncoding;
			}

			params[mapType] = map;
		}

		for (const prop in mat) {
			const value = mat[prop];
			let n;

			if (value === '') continue;

			switch (prop.toLowerCase()) {
				// Ns is material specular exponent

				case 'kd':
					// Diffuse color (color under white light) using RGB values
					params.color = new Color().fromArray(value as number[]).convertSRGBToLinear();

					break;

				case 'ks':
					// Specular color (color when light is reflected from shiny surface) using RGB values
					params.specular = new Color().fromArray(value as number[]).convertSRGBToLinear();

					break;

				case 'ke':
					// Emissive using RGB values

					params.emissive = new Color().fromArray(value as number[]).convertSRGBToLinear();

					break;

				case 'map_kd':
					// Diffuse texture map
					setMapForType('map', value as string);

					break;

				case 'map_ks':
					// Specular map
					setMapForType('specularMap', value as string);

					break;

				case 'map_ke':
					// Emissive map
					setMapForType('emissiveMap', value as string);

					break;

				case 'norm':
					setMapForType('normalMap', value as string);

					break;

				case 'map_bump':
				case 'bump':
					// Bump texture map

					setMapForType('bumpMap', value as string);

					break;

				case 'map_d':
					// Alpha map
					setMapForType('alphaMap', value as string);
					params.transparent = true;

					break;

				case 'ns':
					// The specular exponent (defines the focus of the specular highlight)
					// A high exponent results in a tight, concentrated highlight. Ns values normally range from 0 to 1000.

					if (typeof value === 'string') params.shininess = parseFloat(value);
					else if (typeof value === 'number') params.shininess = value;

					break;
				case 'd':
					if (typeof value === 'string') {
						n = parseFloat(value);
					} else if (typeof value === 'number') {
						n = value;
					}

					if (n && n < 1) {
						params.opacity = n;
						params.transparent = true;
					}

					break;

				case 'tr':
					if (typeof value === 'string') n = parseFloat(value);
					else if (typeof value === 'number') n = value;

					if (this.options && this.options.invertTrProperty && n) n = 1 - n;

					if (n && n > 0) {
						params.opacity = 1 - n;
						params.transparent = true;
					}

					break;

				default:
					break;
			}
		}

		this.materials[materialName] = new MeshPhongMaterial(params);
		return this.materials[materialName];
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	getTextureParams(value: string, matParams: any) {
		const texParams = {
			scale: new Vector2(1, 1),
			offset: new Vector2(0, 0)
		} as TexParams;

		const items = value.split(/\s+/);
		let pos;

		pos = items.indexOf('-bm');

		if (pos >= 0) {
			matParams.bumpScale = parseFloat(items[pos + 1]);
			items.splice(pos, 2);
		}

		pos = items.indexOf('-s');

		if (pos >= 0) {
			texParams.scale.set(parseFloat(items[pos + 1]), parseFloat(items[pos + 2]));
			items.splice(pos, 4); // we expect 3 parameters here!
		}

		pos = items.indexOf('-o');

		if (pos >= 0) {
			texParams.offset.set(parseFloat(items[pos + 1]), parseFloat(items[pos + 2]));
			items.splice(pos, 4); // we expect 3 parameters here!
		}

		texParams.url = items.join(' ').trim();
		return texParams;
	}

	loadTexture(
		url: string,
		mapping?: Mapping,
		onLoad?: (bufferGeometry: unknown) => void,
		onProgress?: (event: ProgressEvent) => void,
		onError?: (event: ErrorEvent) => void
	) {
		const manager = this.manager !== undefined ? this.manager : DefaultLoadingManager;
		const loader = new FileLoader(manager);
		loader.setResponseType('arraybuffer');
		if (loader.setCrossOrigin) loader.setCrossOrigin(this.crossOrigin);
		const imgData = this.extRefHelpers.find(({ src }) => src === url);

		const texture: DataTexture = loader.load(
			url,
			(resource: string | ArrayBuffer) => {
				if (typeof resource === 'string')
					throw new Error(`Error: expected typeof ArrayBuffer, received string`);
				const { width } = imgData;
				console.log(resource.byteLength);
				const arrayData = new Uint8ClampedArray(resource);
				const image = new ImageData(arrayData, width);
				texture.image = image;
				if (mapping !== undefined) texture.mapping = mapping;
				return texture;
			},
			onProgress,
			onError
		);
		return texture;
	}
}

export { MTLLoader };
