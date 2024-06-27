var scene, camera, renderer, loader, controls;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function init() {
    scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(12,5,12);
    // Ajouter OrbitControls après chargement du modèle
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.update(); // Mettre à jour les contrôles une première fois
    renderer.outpuEncoding = THREE.RGBEEncoding;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1.25;
    document.body.appendChild(renderer.domElement);
    var light = new THREE.PointLight(0xffffff);
    light.position.set(10, 10, 10);
    scene.add(light);

    loader = new THREE.GLTFLoader();
	
    loader.load(
        'scene-18.gltf',
        function (gltf) {
            gltf.scene.traverse(function (child) {
                if (child.isMesh && child.name === 'Plane003_3') {
					// Réinitialiser les propriétés d'émission du matériau spécifique
					child.material.emissive = new THREE.Color(0xED7F10); // Noir pour désactiver l'émission
					child.material.emissiveIntensity = 1; // Aucune intensité d'émission
					child.material.toneMapped = false; // Aucune intensité d'émission
				}
				gltf.scene.traverse(function (child) {
				if (child.isLight) {
					// Si l'objet est une lumière, ajustez ses propriétés
					if (child instanceof THREE.DirectionalLight) {
						child.intensity = 0.5; // Exemple: Réduire l'intensité d'une lumière directionnelle
					} else if (child instanceof THREE.PointLight) {
						child.intensity = 0.3; // Exemple: Réduire l'intensité d'une lumière ponctuelle
					}
		
					if (child instanceof THREE.AmbientLight) {
						// Si l'objet est une lumière ambiante, ajustez ses propriétés
						child.intensity = 0.7; // Exemple: Réduire l'intensité de la lumière ambiante
					}
				}
            });
            });
            scene.add(gltf.scene);

        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% chargé');
        },
        function (error) {
            console.error('Erreur lors du chargement du modèle glTF', error);
        }
    );
	document.addEventListener('mousemove', onMouseMove, false);
    animate();
}

function onMouseMove(event) {
    // Mettre à jour la position du pointeur de la souris
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Mettre à jour le rayon de projection pour la souris
    raycaster.setFromCamera(mouse, camera);

    // Trouver les intersections avec les objets de la scène
    var intersects = raycaster.intersectObjects(scene.children, true);

    // Mettre en surbrillance l'objet spécifique
	console.log(intersects)
    if (intersects.length > 0) {
        var selectedObject = intersects.find(function (intersect) {
            return intersect.object.name === 'machine';
        });

        if (selectedObject) {
            var objectToHighlight = selectedObject.object;
            objectToHighlight.material.emissiveIntensity = 1000; // Exemple: intensité d'émission pour la surbrillance
            // Autres ajustements de surbrillance si nécessaire
            highlightedObject = objectToHighlight;
        }
    }
}
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    if (controls) {
        controls.update(); // Mettre à jour les contrôles OrbitControls à chaque frame
    }
}

init();
