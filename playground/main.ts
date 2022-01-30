import mtl from './models/Lowpoly_tree_sample.mtl';

console.log(mtl);

// display mtl on the screen as a pre code tag under the "output" id element
if (document?.getElementById('output')) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  document.getElementById('output').innerHTML = `<pre>${mtl}</pre>`;
}
// ...optionally parse the mtl file and create a mesh from it...
