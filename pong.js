// Initialisation de la scène, de la caméra et du rendu
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Initialisation des contrôles d'orbite
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Ajoute un effet de damping (inertie)
controls.dampingFactor = 0.25; // Facteur de damping
controls.screenSpacePanning = false; // Déplace uniquement la caméra en orbite
controls.minDistance = 5; // Distance minimale de zoom
controls.maxDistance = 100; // Distance maximale de zoom

camera.position.set(-1, 7, -1); // Ajustez la position sur le côté et la profondeur
controls.update(); // Met à jour les contrôles après avoir défini la position de la caméra

const paddleGeometry = new THREE.BoxGeometry(0.8, 0.2, 0.2); // Modifier la géométrie des paddles pour les rendre horizontaux
const paddleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
const paddleMaterial2 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const paddle1 = new THREE.Mesh(paddleGeometry, paddleMaterial);
const paddle2 = new THREE.Mesh(paddleGeometry, paddleMaterial2);
paddle1.position.set(0, 3.5, 0); // Positionner paddle1 en haut
paddle2.position.set(0, -3.5, 0); // Positionner paddle2 en bas
scene.add(paddle1);
scene.add(paddle2);

// Créer la balle
const ballGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
scene.add(ball);

// Créer les murs
const wallGeometry = new THREE.BoxGeometry(0.2, 7, 0.2); // Modifier la géométrie des murs pour les rendre verticaux
const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
leftWall.position.x = -2.5; // Positionner le mur gauche plus près du centre
rightWall.position.x = 2.5; // Positionner le mur droit plus près du centre
scene.add(leftWall);
scene.add(rightWall);

// Variables pour la vitesse de la balle
let ballSpeedX = 0.1;
let ballSpeedY = 0.1;

// Variables pour les paddles
const paddleSpeed = 0.05; // Vitesse ajustée pour des mouvements plus fluides
const paddleLimitX = 2.3; // Limite horizontale pour les paddles

// Variables pour le score
let score1 = 0;
let score2 = 0;
const scoreElement = document.createElement('div');
scoreElement.style.position = 'absolute';
scoreElement.style.top = '10px';
scoreElement.style.left = '10px';
scoreElement.style.color = '#ffffff';
scoreElement.style.fontSize = '24px';
document.body.appendChild(scoreElement);
updateScore();

// Fonction pour mettre à jour le score affiché
function updateScore() {
    scoreElement.innerText = `Score: ${score1} - ${score2}`;
}

// Fonction d'animation
function animate() {
    requestAnimationFrame(animate);
    
    // Déplacement de la balle
	console.log('Position de la caméra :', camera.position);
    ball.position.x += ballSpeedX;
    ball.position.y += ballSpeedY;

    // Collision de la balle avec les murs
    if (ball.position.x >= 2.4 || ball.position.x <= -2.4) {
        ballSpeedX = -ballSpeedX;
    }

    // Balle derrière les paddles - points marqués
    if (ball.position.y <= -4 || ball.position.y >= 4) {
        if (ball.position.y <= -4) {
            score2++;
            updateScore();
            resetBall();
        } else if (ball.position.y >= 4) {
            score1++;
            updateScore();
            resetBall();
        }
    }

    // Collision de la balle avec les paddles
    if (ball.position.y >= paddle1.position.y - 0.1 && ball.position.y <= paddle1.position.y + 0.1 && ball.position.x >= paddle1.position.x - 0.4 && ball.position.x <= paddle1.position.x + 0.4) {
        ballSpeedY = -ballSpeedY;
        ball.position.y = paddle1.position.y - 0.1; // Repositionner la balle à la surface du paddle
    }
    if (ball.position.y >= paddle2.position.y - 0.1 && ball.position.y <= paddle2.position.y + 0.1 && ball.position.x >= paddle2.position.x - 0.4 && ball.position.x <= paddle2.position.x + 0.4) {
        ballSpeedY = -ballSpeedY;
        ball.position.y = paddle2.position.y + 0.1; // Repositionner la balle à la surface du paddle
    }

    // Vérifier si un joueur a gagné (ex: atteint 10 points)
    if (score1 === 10 || score2 === 10) {
        alert(`Joueur ${score1 === 10 ? '1' : '2'} a gagné!`);
        score1 = 0;
        score2 = 0;
        updateScore();
    }

    controls.update(); // Met à jour les contrôles à chaque frame
    // Rendu de la scène
    renderer.render(scene, camera);
}

// Fonction pour réinitialiser la balle au centre après un point marqué
function resetBall() {
    ball.position.x = 0;
    ball.position.y = 0;
    ballSpeedX = Math.random() > 0.5 ? 0.1 : -0.1;
    ballSpeedY = Math.random() > 0.5 ? 0.1 : -0.1;
}

// Gestion des événements de pression des touches
let keys = {};
document.addEventListener('keydown', function (e) {
    keys[e.key] = true;
});

document.addEventListener('keyup', function (e) {
    delete keys[e.key];
});

// Boucle de mise à jour des paddles
function updatePaddles() {
    if ('ArrowLeft' in keys && paddle1.position.x > -paddleLimitX) {
        paddle1.position.x -= paddleSpeed;
    }
    if ('ArrowRight' in keys && paddle1.position.x < paddleLimitX) {
        paddle1.position.x += paddleSpeed;
    }
    if ('a' in keys && paddle2.position.x > -paddleLimitX) {
        paddle2.position.x -= paddleSpeed;
    }
    if ('d' in keys && paddle2.position.x < paddleLimitX) {
        paddle2.position.x += paddleSpeed;
    }

    // Demander à être rappelé avant le prochain rafraîchissement
    requestAnimationFrame(updatePaddles);
}

// Lancer la mise à jour des paddles
updatePaddles();

// Ajuster la taille du rendu à la taille de la fenêtre
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Lancer l'animation
animate();
