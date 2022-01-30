<script lang="ts">
	import * as THREE from 'three';
	import * as SC from 'svelte-cubed';
	import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
  import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
	import treeMat from '../../static/models/demo2/Car.mtl';
  import treeObj from '../../static/models/demo2/Car.obj';
  const loadMtl = async ()  => {
    const material =  new MTLLoader().parse(treeMat, 'models/demo2/')
    material.preload()
    return material
  } 
  let clock = new THREE.Clock(),
    time = 0,
    delta = 0,
    ballYRotation = 0,
    width = 0,
    height = 0

  SC.onFrame(() => {
			delta = clock.getDelta();
			time += delta;
			ballYRotation = time * 1.5;
		});
			
</script>

<div class='basicContainer' bind:clientHeight={height} bind:clientWidth={width}>
  {#await loadMtl()}
    <div class="loadingContainer">
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
    </div>
  {:then loadedMaterial}
    <SC.Canvas antialias background={new THREE.Color('papayawhip')} shadows {width} {height}>
          <SC.Primitive
            position={[0, 0, 0]}
            object={new OBJLoader().setMaterials(loadedMaterial).parse(treeObj)}
            rotation={[0, ballYRotation, 0]}
          />
      <SC.PerspectiveCamera position={[50, 50, 50]} />
      <SC.OrbitControls enableZoom={true} maxPolarAngle={Math.PI * 0.51} />
      <SC.AmbientLight intensity={0.6} />
      <SC.DirectionalLight intensity={0.6} position={[-2, 3, 2]} shadow={{ mapSize: [2048, 2048] }} />
    </SC.Canvas>
  {/await}
</div>