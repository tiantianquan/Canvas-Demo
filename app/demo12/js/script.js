var camera, scene, renderer, light
var geometry, material, mesh, egh, long
long = 100

function init() {

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 800
  camera.position.x = 1000
  camera.position.y = 80
  camera.rotation.y = Math.PI / 2.5

  scene = new THREE.Scene()

  light = new THREE.PointLight(0xffffff, 1, 1000);
  light.position.set(200, 100, 500)
  scene.add(light)


  geometry = new THREE.BoxGeometry(long, long, long)
  geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, long / 2, -long / 2))

  material = new THREE.MeshLambertMaterial({
    color: 0xeeeeee,
    emissive: 'steelblue'
  })


  mesh = new THREE.Mesh(geometry, material);
  // mesh.visible = false
  scene.add(mesh)

  egh = new THREE.EdgesHelper(mesh, 0x000000);
  egh.material.linewidth = 1;
  // scene.add(egh)

  renderer = new THREE.WebGLRenderer({
    antialias: true
  })
  renderer.setClearColor(0xeeeeee)
  renderer.setSize(window.innerWidth, window.innerHeight)



  document.body.appendChild(renderer.domElement);


  var tween = {
    go: function(times) {
      var i = 1
      tween.tl1 = function() {
        TweenLite.to(mesh.rotation, .3, {
          x: mesh.rotation.x + Math.PI / 2,
          onComplete: function() {
            mesh.position.set(0, 0, long * i);
            mesh.rotation.set(0, 0, 0);
            i++
            if (i > times) {
              // tween.tl2()
              return
            } else {
              this.restart()
            }
          },
          ease: Linear.easeNone,
        })
      }

      // tween.tl2 = function() {
      //   TweenLite.to(mesh.rotation, 5, {
      //     x: mesh.rotation.x - Math.PI / 2,
      //     onComplete: function() {
      //       i--
      //       mesh.position.set(0, 0, long * i);
      //       mesh.rotation.set(0, 0, 0);
      //       if (i <1) {
      //         tween.tl1()
      //       } else {
      //         this.restart()
      //       }
      //     },
      //     ease: Linear.easeNone,
      //   })
      // }
      tween.tl1()
    }
  }

  tween.go(10)
}


function animate() {

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}



init()
animate()