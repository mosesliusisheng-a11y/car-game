const car = document.getElementById('car');
const gameArea = document.getElementById('game-container');
const targetCircle = document.getElementById('target-circle');

const btnUp = document.getElementById('btn-up');
const btnDown = document.getElementById('btn-down');
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');

// Game state
let carX = 50;
let carY = 50;
let carType = 'police'; // 'police' (black), 'red', or 'yellow'
let targetType = 'red';   // The color the player needs to find
let gameEnded = false;    // Stops movement after win/lose
const moveStep = 3;

let moveInterval = null;
let currentDirection = null;

// Dictionary to translate types to emojis
const carEmojis = {
    police: { vertical: '🚔', horizontal: '🚓' },
    red:    { vertical: '🚘', horizontal: '🚗' },
    yellow: { vertical: '🚖', horizontal: '🚕' }
};

const targetEmojis = {
    black: '⚫️',
    red: '🔴',
    yellow: '🟡'
};

// Function to update car emoji and flip status based on direction
function updateCarVisuals(direction) {
    let isFlipped = false;
    let emoji = '';

    if (direction === 'up' || direction === 'down') {
        emoji = carEmojis[carType].vertical;
    } else if (direction === 'left' || direction === 'right') {
        emoji = carEmojis[carType].horizontal;
        if (direction === 'right') isFlipped = true;
    }

    car.textContent = emoji;
    if (isFlipped) {
        car.classList.add('flip');
    } else {
        car.classList.remove('flip');
    }
}

// Function to move the car
function moveCar(direction) {
    if (gameEnded) return; // Stop moving if game is over

    currentDirection = direction;

    if (direction === 'up') carY -= moveStep;
    if (direction === 'down') carY += moveStep;
    if (direction === 'left') carX -= moveStep;
    if (direction === 'right') carX += moveStep;

    // Keep inside boundaries
    if (carX < 5) carX = 5;
    if (carX > 95) carX = 95;
    if (carY < 5) carY = 5;
    if (carY > 95) carY = 95;

    car.style.top = carY + '%';
    car.style.left = carX + '%';

    updateCarVisuals(direction);
    checkCollisions();
}

// Collision detection
function checkCollisions() {
    const carRect = car.getBoundingClientRect();
    
    const squares = [
        { id: 'sq-red', type: 'red' },
        { id: 'sq-yellow', type: 'yellow' },
        { id: 'sq-black', type: 'police' } 
    ];

    for (let sq of squares) {
        const sqElement = document.getElementById(sq.id);
        const sqRect = sqElement.getBoundingClientRect();

        if (!(carRect.right < sqRect.left || 
              carRect.left > sqRect.right || 
              carRect.bottom < sqRect.top || 
              carRect.top > sqRect.bottom)) {
            
            // Update Car Type
            if (carType !== sq.type) {
                carType = sq.type;
                let currentEmoji = car.textContent;
                if (currentEmoji === '🚔' || currentEmoji === '🚘' || currentEmoji === '🚖') {
                    updateCarVisuals(carRect.top > sqRect.top ? 'up' : 'down');
                } else {
                    updateCarVisuals(carRect.left > sqRect.left ? 'left' : 'right');
                }
            }

            // --- WIN/LOSE SYSTEM ---
            // Compare the square type to the target circle type
            if (sq.type === targetType) {
                targetCircle.textContent = '✅';
                gameEnded = true; // Stop the car from moving further
            } else {
                targetCircle.textContent = '❎';
                gameEnded = true; 
            }
            break; 
        }
    }
}

// --- CONTINUOUS MOVEMENT ENGINE ---

function startMoving(direction) {
    if (gameEnded) return; // Don't start moving if game is over
    if (moveInterval !== null) return; 
    
    moveCar(direction); 
    
    moveInterval = setInterval(() => {
        moveCar(direction);
    }, 40); 
}

function stopMoving() {
    clearInterval(moveInterval);
    moveInterval = null;
}

// Button Event Listeners
btnUp.addEventListener('pointerdown', (e) => { e.preventDefault(); startMoving('up'); });
btnDown.addEventListener('pointerdown', (e) => { e.preventDefault(); startMoving('down'); });
btnLeft.addEventListener('pointerdown', (e) => { e.preventDefault(); startMoving('left'); });
btnRight.addEventListener('pointerdown', (e) => { e.preventDefault(); startMoving('right'); });

document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('pointerup', stopMoving);
    btn.addEventListener('pointerleave', stopMoving);
    btn.addEventListener('pointercancel', stopMoving);
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    if (e.key === 'ArrowUp' || e.key === 'w') startMoving('up');
    if (e.key === 'ArrowDown' || e.key === 's') startMoving('down');
    if (e.key === 'ArrowLeft' || e.key === 'a') startMoving('left');
    if (e.key === 'ArrowRight' || e.key === 'd') startMoving('right');
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'w') stopMoving();
    if (e.key === 'ArrowDown' || e.key === 's') stopMoving();
    if (e.key === 'ArrowLeft' || e.key === 'a') stopMoving();
    if (e.key === 'ArrowRight' || e.key === 'd') stopMoving();
});

// --- GAME INITIALIZATION ---
function resetGame() {
    carX = 50;
    carY = 50;
    car.style.top = carY + '%';
    car.style.left = carX + '%';
    gameEnded = false;

    // 1. Pick a random target color for the circle (red or yellow, since black isn't a target in this logic)
    const targetOptions = ['red', 'yellow'];
    targetType = targetOptions[Math.floor(Math.random() * targetOptions.length)];
    targetCircle.textContent = targetEmojis[targetType];

    // 2. Pick a random starting car type that is DIFFERENT from the target
    const carOptions = ['police', 'red', 'yellow'].filter(type => type !== targetType);
    carType = carOptions[Math.floor(Math.random() * carOptions.length)];

    // 3. Set the initial car emoji (front view facing down by default)
    car.textContent = carEmojis[carType].vertical;
    car.classList.remove('flip');
}

// Start the game when the script loads!
resetGame();
