<script lang="ts">
	import * as THREE from 'three';
	import * as SC from 'svelte-cubed';
	import Worker from '$lib/_worker/offscreen?worker';
	import { onMount } from 'svelte';
	import { getCapabilities } from 'svelte-cubed';
	import type { OffscreenCanvas } from 'three';
	let width: number;
	let height: number;

	let canvas: SC.Canvas;

	onMount(() => {
		const capabilities = getCapabilities();
		console.log(capabilities);
		const offscreen: OffscreenCanvas = canvas.transferControlToOffscreen();
		const worker = new Worker();
		worker.postMessage({
			drawingSurface: offscreen,
			width: width,
			height: height,
			pixelRatio: window.devicePixelRatio
		});
	});
</script>

<div class="basicContainer" bind:clientHeight={height} bind:clientWidth={width}>
	<SC.Canvas
		bind:this={canvas}
		antialias
		background={new THREE.Color('papayawhip')}
		shadows
		{width}
		{height}
	/>
</div>
