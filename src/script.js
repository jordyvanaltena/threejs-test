import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
// Debug
// const gui = new dat.GUI()


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

const loader = new GLTFLoader();

const gui = new GUI()
const modelFolder = gui.addFolder('Model Rotation')
const backdropColor = gui.addFolder('Curtain color')

let model

loader.load( './chair-web.glb', function ( gltf ) {
    model = gltf.scene
	// scene.add( model );

    scene.add(model);
    modelFolder.add(model.rotation, 'y', 0, Math.PI * 2)
    console.log(model)


    backdropColor.add(model.children[3].material.color, 'r' , 0, 1)
    backdropColor.add(model.children[3].material.color, 'g' , 0, 1)
    backdropColor.add(model.children[3].material.color, 'b' , 0, 1)
    backdropColor.add(model.children[3], 'visible' , true, false)
    backdropColor.add(model.children[3].material, 'wireframe' , true, false)


    const chair = gui.addFolder('chair')
    chair.add(model.children[4].children[6].material, 'wireframe', true, false)
    chair.add(model.children[4].rotation, 'y', 0, 10)
    console.log(model.children[4].children[6])
    
    
}, undefined, function ( error ) {
	console.error( error );
} );


const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'z', 0, 10)
cameraFolder.add(camera.position, 'x', -4, 4)
cameraFolder.add(camera.position, 'y', 0, 4)


// Lights
const pointLight = new THREE.PointLight(0xffffff,1)

pointLight.position.x = 5
pointLight.position.y = 3
pointLight.position.z = 4

scene.add(pointLight)
const pointLightLocation = gui.addFolder('Point Light Location')
pointLightLocation.add(pointLight.position, 'z', 0, 10)
pointLightLocation.add(pointLight.position, 'x', -4, 4)
pointLightLocation.add(pointLight.position, 'y', 0, 4)

const pointLightColor = gui.addFolder('Point Light Color')
pointLightColor.add(pointLight.color, 'r', 0, 1)
pointLightColor.add(pointLight.color, 'g', 0, 1)
pointLightColor.add(pointLight.color, 'b', 0, 1)
pointLightColor.add(pointLight, 'visible', true, false)

const ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( ambientLight );

const ambientLightIntensity = gui.addFolder('Ambient Light intensity')
ambientLightIntensity.add(ambientLight, 'intensity', 0, 10)

const ambientLightColor = gui.addFolder('Ambient Light Color')
ambientLightColor.add(ambientLight.color, 'r', 0, 1)
ambientLightColor.add(ambientLight.color, 'g', 0, 1)
ambientLightColor.add(ambientLight.color, 'b', 0, 1)
ambientLightColor.add(ambientLight, 'visible', true, false)

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})



/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true
/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // sphere.rotation.y = .5 * elapsedTime
    // loader.rotation.y = .5 * elapsedTime

    // Render
    controls.update();
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()