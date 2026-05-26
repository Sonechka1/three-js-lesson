import * as THREE from 'three';
import TWEEN from 'three/examples/jsm/libs/tween.module';


import init from './init';

import './style.css';

const { sizes, camera, scene, canvas, controls, renderer } = init();

camera.position.z = 100;

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({
// 	color: 'gray',
// 	wireframe: true,
// });
// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);


const group = new THREE.Group();

const geometries = [
	new THREE.CapsuleGeometry( 8, 8, 4, 10, 1 ),
	new THREE.RingGeometry( 1, 5, 32 ),
	new THREE.TetrahedronGeometry(10,10,10),
	new THREE.TorusGeometry( 5, 3, 16, 10 ),
	new THREE.BoxGeometry( 10, 10, 10 ),
	new THREE.ConeGeometry( 5, 20, 32 ),
	new THREE.DodecahedronGeometry(8, 8,8),
	new THREE.OctahedronGeometry(8,8,8),
	new THREE.TorusKnotGeometry( 10, 3, 100, 16 ),
]

let index = 0;
let activeIndex = -1;
for(let i = -30; i<=30; i+=30){
	for(let j = -30; j<=30; j+=30){
		 const material = new THREE.MeshBasicMaterial({
					color: 'gray',
					wireframe: true,});

		const mesh = new THREE.Mesh(geometries[index], material);
		mesh.position.set(i, j, 10);
		mesh.index = index;
		mesh.basePosition = new THREE.Vector3(i, j, 10);
		group.add(mesh);
		index+=1;
	}
}

scene.add(group);

const clock = new THREE.Clock();
const tick = () => {

	const delta  = clock.getDelta();
	if(activeIndex !== -1){
		group.children[activeIndex].rotation.y += delta *0.5;
	}
	
	controls.update();
	TWEEN.update();
	renderer.render(scene, camera);
	window.requestAnimationFrame(tick);
};
tick();


const resetActive = () =>{
	group.children[activeIndex].material.color.set('gray');

	new TWEEN.Tween(group.children[activeIndex].position).to({
			x: group.children[activeIndex].basePosition.x,
			y:group.children[activeIndex].basePosition.y,
			z: group.children[activeIndex].basePosition.z
		}, Math.random() * 1000 + 1000).easing(TWEEN.Easing.Exponential.InOut).start();

	activeIndex = -1;
	
	
}

const raycaster = new THREE.Raycaster();

const handleClick = (e) =>{
	const pointer = new THREE.Vector2();
	pointer.x = (e.clientX / window.innerWidth) *2 -1;
	pointer.y = -(e.clientY/ window.innerHeight) *2 +1 ;

	raycaster.setFromCamera(pointer, camera);
	const intersections = raycaster.intersectObjects(scene.children);
	if(activeIndex !== -1){
		resetActive();
	}
	for(let i = 0; i< intersections.length; i+=1){
		intersections[i].object.material.color.set('pink')
		activeIndex = intersections[i].object.index;

		new TWEEN.Tween(intersections[i].object.position).to({
			x: 0,
			y:0,
			z: 55
		}, Math.random() * 1000 + 1000).easing(TWEEN.Easing.Exponential.InOut).start();

	}
	
}

window.addEventListener('click' , handleClick);



/** Базовые обпаботчики событий длы поддержки ресайза */
window.addEventListener('resize', () => {
	// Обновляем размеры
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Обновляем соотношение сторон камеры
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Обновляем renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.render(scene, camera);
});

window.addEventListener('dblclick', () => {
	if (!document.fullscreenElement) {
		canvas.requestFullscreen();
	} else {
		document.exitFullscreen();
	}
});
