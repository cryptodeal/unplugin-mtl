<script lang="ts">
	import * as THREE from 'three';
	import * as SC from 'svelte-cubed';
	import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
	import treeMat from '$lib/models/Lowpoly_tree_sample.mtl';
  import treeObj from '$lib/models/Lowpoly_tree_sample.obj';

</script>

<SC.Canvas antialias background={new THREE.Color('papayawhip')} shadows>
	<SC.Mesh geometry={new MTLLoader().parse(treeObj)} />

	<SC.PerspectiveCamera position={[50, 50, 50]} />
	<SC.OrbitControls enableZoom={true} maxPolarAngle={Math.PI * 0.51} />
	<SC.AmbientLight intensity={0.6} />
	<SC.DirectionalLight intensity={0.6} position={[-2, 3, 2]} shadow={{ mapSize: [2048, 2048] }} />
</SC.Canvas>
