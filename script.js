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
const moveStep = 10; // moves 10% of the screen per click

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
        { id: 'sq-black', type: 'police' } // Black turns it back to police
    ];

    for (let sq of squares) {
        const sqElement = document.getElementById(sq.id);
        const sqRect = sqElement.getBoundingClientRect();

        // Simple AABB (Axis-Aligned Bounding Box) collision detection
        if (!(carRect.right < sqRect.left || 
              carRect.left > sqRect.right || 
              carRect.bottom < sqRect.top || 
              carRect.top > sqRect.bottom)) {
            
            // Only update if the car type changes to avoid constant re-rendering
            if (carType !== sq.type) {
                carType = sq.type;
                // We re-run updateCarVisuals without changing direction to swap the emoji
                const currentDirection = car.classList.contains('flip') ? 'right' : 
                                         (car.style.top !== '50%' ? 'down' : 'right'); // fallback
                 
                // To keep it simple, we just figure out if it's horizontal or vertical right now
                let currentEmoji = car.textContent;
                if (currentEmoji === '🚔' || currentEmoji === '🚘' || currentEmoji === '🚖') {
                    updateCarVisuals(carRect.top > sqRect.top ? 'up' : 'down'); // maintaining vertical view
                } else {
                    updateCarVisuals(carRect.left > sqRect.left ? 'left' : 'right'); // maintaining horizontal view
                }
            }
            break; // Stop checking other squares if we hit one
        }
    }
}

// Event Listeners for Buttons
btnUp.addEventListener('click', () => moveCar('up'));
btnDown.addEventListener('click', () => moveCar('down'));
btnLeft.addEventListener('click', () => moveCar('left'));
btnRight.addEventListener('click', () => moveCar('right'));

// Keyboard support (WASD and Arrow Keys)
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'w') moveCar('up');
    if (e.key === 'ArrowDown' || e.key === 's') moveCar('down');
    if (e.key === 'ArrowLeft' || e.key === 'a') moveCar('left');
    if (e.key === 'ArrowRight' || e.key === 'd') moveCar('right');
});
