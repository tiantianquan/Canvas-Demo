var camera, scene, renderer
var geometry, material, mesh, egh

var geometry = new THREE.Geometry();
var long = 1000
geometry.vertices.push(
  new THREE.Vector3(0, 2 * long, 0),
  new THREE.Vector3(-long, 0, long),
  new THREE.Vector3(long, 0, long),
  new THREE.Vector3(long, 0, -long),
  new THREE.Vector3(-long, 0, -long)
)

geometry.faces.push(
  new THREE.Face3(0, 1, 2),
  new THREE.Face3(0, 2, 3),
  new THREE.Face3(0, 3, 4),
  new THREE.Face3(0, 4, 1),
  new THREE.Face3(1, 2, 3),
  new THREE.Face3(1, 3, 4)
)

// geometry.computeFaceNormals ()


init();
animate();

function init() {

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 8000
  camera.position.y = 1000

  scene = new THREE.Scene();

  // geometry = new THREE.BoxGeometry(200, 200, 200);
  material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    // wireframe: true
  });

  mesh = new THREE.Mesh(geometry, material);
  mesh.visible = true
  scene.add(mesh)
  egh = new THREE.EdgesHelper(mesh, 0x000000);
  egh.material.linewidth = 2;
  scene.add(egh)

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0Xeeeeee)
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);


  var tween = {
    scale: 1.4,
    go: function() {
      TweenLite.to(mesh.position, .3, {
        // x: this.scale,
        // y: this.scale,
        // z: this.scale,
        z: 1000,
        onComplete: function() {
          // renderer.setClearColor(0xffffff)
          // egh.material.color = new THREE.Color(0x000000)
          this.reverse()
        },
        onReverseComplete: function() {
          // renderer.setClearColor(0x000000)
          // egh.material.color = new THREE.Color(0xffffff)
          this.play()
        }
      })
    }
  }
  tween.go()
}


function animate() {
  requestAnimationFrame(animate);
  // mesh.rotation.x += 0.05;
  mesh.rotation.y += 0.01;
  // mesh.scale.x += 0.01
  renderer.render(scene, camera);
}