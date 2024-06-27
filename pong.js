// Initialisation de la scène, de la caméra et du rendu
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Déplacement de la caméra
// Déplacement de la caméra derrière le paddle 1 (pour voir le paddle 2 de dos)
camera.position.set(0,0,6); // Ajustez la position sur le côté et la profondeur
// const cameraLookAt = new THREE.Vector3(0, 0, 0); // Point de vue de la caméra

// Déplacement de la caméra initiale
// camera.position.copy(cameraPosition);
// camera.lookAt(cameraLookAt);
camera.rotation.set(0, 0, Math.PI / 2); 
// Créer les paddlesFFFF00
const paddleGeometry = new THREE.BoxGeometry(0.2, 0.8, 0.2);
const paddleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
const paddleMaterial2 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const paddle1 = new THREE.Mesh(paddleGeometry, paddleMaterial);
const paddle2 = new THREE.Mesh(paddleGeometry, paddleMaterial2);
paddle1.position.set(-4, 0, 0);
paddle2.position.set(4, 0, 0);
scene.add(paddle1);
scene.add(paddle2);

// Créer la balle
const ballGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
scene.add(ball);

// Créer les murs
const wallGeometry = new THREE.BoxGeometry(8, 0.2, 0.2);
const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const topWall = new THREE.Mesh(wallGeometry, wallMaterial);
const bottomWall = new THREE.Mesh(wallGeometry, wallMaterial);
topWall.position.y = 3;
bottomWall.position.y = -3;
scene.add(topWall);
scene.add(bottomWall);

// Variables pour la vitesse de la balle
let ballSpeedX = 0.1;
let ballSpeedY = 0.1;

// Variables pour les paddles
const paddleSpeed = 0.05; // Vitesse ajustée pour des mouvements plus fluides
const paddleLimitY = 2.5; // Limite verticale pour les paddles

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
    ball.position.x += ballSpeedX;
    ball.position.y += ballSpeedY;

    // Collision de la balle avec les murs
    if (ball.position.y >= 2.9 || ball.position.y <= -2.9) {
        ballSpeedY = -ballSpeedY;
    }

    // Balle derrière les paddles - points marqués
    if (ball.position.x <= -5 || ball.position.x >= 5) {
        if (ball.position.y <= -2.7) {
            score2++;
            updateScore();
            resetBall();
        } else if (ball.position.y >= 2.7) {
            score1++;
            updateScore();
            resetBall();
        }
    }

    // Collision de la balle avec les paddles
    if (ball.position.y <= paddle1.position.y + 0.4 && ball.position.y >= paddle1.position.y - 0.4 && ball.position.x <= paddle1.position.x + 0.1 && ball.position.x >= paddle1.position.x - 0.1) {
        ballSpeedX = -ballSpeedX;
        ball.position.x = paddle1.position.x + 0.1; // Repositionner la balle à la surface du paddle
    }
    if (ball.position.y <= paddle2.position.y + 0.4 && ball.position.y >= paddle2.position.y - 0.4 && ball.position.x <= paddle2.position.x + 0.1 && ball.position.x >= paddle2.position.x - 0.1) {
        ballSpeedX = -ballSpeedX;
        ball.position.x = paddle2.position.x - 0.1; // Repositionner la balle à la surface du paddle
    }

    // Vérifier si un joueur a gagné (ex: atteint 10 points)
    if (score1 === 10 || score2 === 10) {
        alert(`Joueur ${score1 === 10 ? '1' : '2'} a gagné!`);
        score1 = 0;
        score2 = 0;
        updateScore();
    }

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
    if ('ArrowUp' in keys && paddle1.position.y < paddleLimitY) {
        paddle1.position.y += paddleSpeed;
    }
    if ('ArrowDown' in keys && paddle1.position.y > -paddleLimitY) {
        paddle1.position.y -= paddleSpeed;
    }
    if ('w' in keys && paddle2.position.y < paddleLimitY) {
        paddle2.position.y += paddleSpeed;
    }
    if ('s' in keys && paddle2.position.y > -paddleLimitY) {
        paddle2.position.y -= paddleSpeed;
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
