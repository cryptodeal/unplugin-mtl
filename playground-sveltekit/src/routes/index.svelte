<script lang="ts">
	import * as THREE from 'three';
	import * as SC from 'svelte-cubed';
	import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
	import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
	import { mtl, extRef, extRefHelpers } from '$lib/models/demo2/Car.mtl';
	import obj from '$lib/models/demo2/Car.obj';
	import { onMount } from 'svelte';
	let object;
	$: console.log(`.mtl file helper, uses external resources: ${extRef}`);
	$: console.log(extRefHelpers);

	onMount(() => {
		const materials = new MTLLoader().parse(mtl, '');
		materials.preload();
		object = new OBJLoader().setMaterials(materials).parse(obj);
	});
	let clock = new THREE.Clock(),
		time = 0,
		delta = 0,
		ballYRotation = 0,
		width = 0,
		height = 0;

	SC.onFrame(() => {
		delta = clock.getDelta();
		time += delta;
		ballYRotation = time * 1.5;
	});
	$: if (object?.children[0] instanceof THREE.Mesh) console.log(object.children[0].material);
</script>

<div class="basicContainer" bind:clientHeight={height} bind:clientWidth={width}>
	{#if !object}
		<div class="loadingContainer">
			<div class="wave" />
			<div class="wave" />
			<div class="wave" />
			<div class="wave" />
			<div class="wave" />
			<div class="wave" />
			<div class="wave" />
			<div class="wave" />
			<div class="wave" />
			<div class="wave" />
		</div>
	{:else}
		<SC.Canvas antialias background={new THREE.Color('papayawhip')} shadows {width} {height}>
			{#if object.children[0] instanceof THREE.Mesh}
				<SC.Mesh
					position={[0, 0, 0]}
					geometry={object.children[0].geometry}
					material={object.children[0].material}
					rotation={[0, ballYRotation, 0]}
				/>
			{/if}
			<SC.PerspectiveCamera position={[50, 50, 50]} />
			<SC.OrbitControls enableZoom={true} maxPolarAngle={Math.PI * 0.51} />
			<SC.AmbientLight intensity={0.6} />
			<SC.DirectionalLight
				intensity={0.6}
				position={[-2, 3, 2]}
				shadow={{ mapSize: [2048, 2048] }}
			/>
		</SC.Canvas>
	{/if}
</div>
