// var renderer = new THREE.WebGLRenderer()
// renderer.setClearColor('#000'); // black
// renderer.setSize(window.innerWidth,window.innerHeight)
// document.body.appendChild(renderer.domElement)

// //建立场景
// var scene = new THREE.Scene();

// //建立摄像机
// var camera = new THREE.PerspectiveCamera(45,
//   c.width / c.height, 0.01, 10000);
// camera.position.set(4, 0, 10);
// camera.lookAt(new THREE.Vector3(0, 0, 0));
// scene.add(camera);

// var boxgeo = new THREE.BoxGeometry(1, 2, 3)
// var boxmat = new THREE.MeshBasicMaterial({
//   color: 0xffffff,
//   wireframe: true,
//   wireframeLinewidth:1
// })

// var box = new THREE.Mesh(boxgeo,boxmat);
// scene.add(box);
// // var light = new THREE.PointLight(0xffffff, 2, 100);
// // light.position.set(0, 1.5, 2);
// // scene.add(light);
// renderer.render(scene, camera);


var camera, scene, renderer;
var geometry, material, mesh, egh;

init();
animate();

function init() {

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 1000;

  scene = new THREE.Scene();

  geometry = new THREE.CubeGeometry(200, 200, 200);
  material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true
  });

  mesh = new THREE.Mesh(geometry, material);
  mesh.visible = false
  scene.add(mesh)
  egh = new THREE.EdgesHelper(mesh, 0x00ffff);
  egh.material.linewidth = 1;
  scene.add(egh)

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

}

function animate() {
  requestAnimationFrame(animate);
  mesh.rotation.x += 0.001;
  mesh.rotation.y += 0.001;
  renderer.render(scene, camera);
}