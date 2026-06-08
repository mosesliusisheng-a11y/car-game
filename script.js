const car = document.getElementById('car');
const gameArea = document.getElementById('game-container');

const btnUp = document.getElementById('btn-up');
const btnDown = document.getElementById('btn-down');
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');

// Game state
let carX = 50; // percentage from left
let carY = 50; // percentage from top
let carType = 'police'; // can be 'police', 'red', or 'yellow'
const moveStep = 2; // Smaller step for smoother movement

let moveInterval = null; // Variable to hold the continuous movement timer
let currentDirection = null; // Track the current direction

// Function to update car emoji and flip status based on direction
function updateCarVisuals(direction) {
    let isFlipped = false;
    let emoji = '';

    if (direction === 'up' || direction === 'down') {
        if (carType === 'police') emoji = '🚔';
        else if (carType === 'red') emoji = '🚘';
        else if (carType === 'yellow') emoji = '🚖';
    } else if (direction === 'left' || direction === 'right') {
        if (carType === 'police') emoji = '🚓';
        else if (carType === 'red') emoji = '🚗';
        else if (carType === 'yellow') emoji = '🚕';

        if (direction === 'right') {
            isFlipped = true;
        }
    }

    car.textContent = emoji;
    if (isFlipped) {
        car.classList.add('flip');
    } else {
        car.classList.remove('flip');
    }
}

// Function to move the car and check collisions
function moveCar(direction) {
    currentDirection = direction; // Update current direction

    // Move
    if (direction === 'up') carY -= moveStep;
    if (direction === 'down') carY += moveStep;
    if (direction === 'left') carX -= moveStep;
    if (direction === 'right') carX += moveStep;

    // Keep inside the square (boundaries)
    if (carX < 5) carX = 5;
    if (carX > 95) carX = 95;
    if (carY < 5) carY = 5;
    if (carY > 95) carY = 95;

    // Apply position to CSS
    car.style.top = carY + '%';
    car.style.left = carX + '%';

    // Update the emoji and direction
    updateCarVisuals(direction);

    // Check collision with colored squares
    checkCollisions();
}

// Collision detection using coordinates
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
            
            if (carType !== sq.type) {
                carType = sq.type;
                let currentEmoji = car.textContent;
                if (currentEmoji === '🚔' || currentEmoji === '🚘' || currentEmoji === '🚖') {
                    updateCarVisuals(carRect.top > sqRect.top ? 'up' : 'down');
                } else {
                    updateCarVisuals(carRect.left > sqRect.left ? 'left' : 'right');
                }
            }
            break;
        }
    }
}

// --- CONTINUOUS MOVEMENT ENGINE ---

function startMoving(direction) {
    // If already moving in this direction, do nothing
    if (moveInterval !== null) return; 
    
    // Move immediately on the first press
    moveCar(direction); 
    
    // Set a timer to keep moving every 30 milliseconds as long as it's held
    moveInterval = setInterval(() => {
        moveCar(direction);
    }, 30); 
}

function stopMoving() {
    // Stop the continuous movement timer
    clearInterval(moveInterval);
    moveInterval = null;
}

// Button Event Listers (Pointer Down to start, Pointer Up to stop)
btnUp.addEventListener('pointerdown', (e) => { e.preventDefault(); startMoving('up'); });
btnDown.addEventListener('pointerdown', (e) => { e.preventDefault(); startMoving('down'); });
btnLeft.addEventListener('pointerdown', (e) => { e.preventDefault(); startMoving('left'); });
btnRight.addEventListener('pointerdown', (e) => { e.preventDefault(); startMoving('right'); });

// When the button is released, stop moving
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('pointerup', stopMoving);
    btn.addEventListener('pointerleave', stopMoving); // Stops if finger slides off button
    btn.addEventListener('pointercancel', stopMoving); // Stops if browser cancels the touch
});

// Keyboard support (WASD and Arrow Keys)
document.addEventListener('keydown', (e) => {
    if (e.repeat) return; // Prevents keyboard repeat stuttering
    if (e.key === 'ArrowUp' || e.key === 'w') startMoving('up');
    if (e.key === 'ArrowDown' || e.key === 's') startMoving('down');
    if (e.key === 'ArrowLeft' || e.key === 'a') startMoving('left');
    if (e.key === 'ArrowRight' || e.key === 'd') startMoving('right');
});

document.addEventListener('keyup', (e) => {
    // Only stop if the key released matches the current moving direction
    if (e.key === 'ArrowUp' || e.key === 'w') stopMoving();
    if (e.key === 'ArrowDown' || e.key === 's') stopMoving();
    if (e.key === 'ArrowLeft' || e.key === 'a') stopMoving();
    if (e.key === 'ArrowRight' || e.key === 'd') stopMoving();
});
