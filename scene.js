// Initialisation de la scène, de la caméra et du rendu
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Initialisation des contrôles d'orbite
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Activer le damping pour des mouvements plus doux
controls.dampingFactor = 0.25; // Facteur de damping (plus petit = plus d'inertie)
controls.screenSpacePanning = false; // Déplacement uniquement en orbite, pas de panning sur l'écran
controls.minDistance = 5; // Distance minimale de zoom
controls.maxDistance = 100; // Distance maximale de zoom
controls.minPolarAngle = 0; // Angle vertical minimum (en radians)
controls.maxPolarAngle = Math.PI; // Angle vertical maximum (en radians)

camera.position.set(0, -8, -2.77); // Ajustez la position sur le côté et la profondeur
controls.update(); // Met à jour les contrôles après avoir défini la position de la caméra

// Création des paddles
const paddleGeometry = new THREE.BoxGeometry(0.8, 0.2, 0.2); // Modifier la géométrie des paddles pour les rendre horizontaux
const paddleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
const paddleMaterial2 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const paddle1 = new THREE.Mesh(paddleGeometry, paddleMaterial);
const paddle2 = new THREE.Mesh(paddleGeometry, paddleMaterial2);
paddle1.position.set(0, 3.5, 0); // Positionner paddle1 en haut
paddle2.position.set(0, -3.5, 0); // Positionner paddle2 en bas
scene.add(paddle1);
scene.add(paddle2);

// Création de la balle
const ballGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
scene.add(ball);

// Création des murs
const wallGeometry = new THREE.BoxGeometry(0.2, 7, 0.2); // Modifier la géométrie des murs pour les rendre verticaux
const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
leftWall.position.x = -2.5; // Positionner le mur gauche plus près du centre
rightWall.position.x = 2.5; // Positionner le mur droit plus près du centre
scene.add(leftWall);
scene.add(rightWall);

// Exporter les éléments nécessaires
window.scene = scene;
window.camera = camera;
window.renderer = renderer;
window.controls = controls;
window.paddle1 = paddle1;
window.paddle2 = paddle2;
window.ball = ball;
window.leftWall = leftWall;
window.rightWall = rightWall;
