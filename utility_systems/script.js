const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');


let player = {

    x: 50, 
    y: 50,
    size: 30,
    color: 'blue'
};

let enemy = {
    x: 300,
    y: 300,
    size: 30, 
    color: 'red',
    speed: 1
};


function drawObject(obj) {

    ctx.fillStyle = obj.color;
    ctx.fillRect(obj.x, obj.y, obj.size, obj.size);

}


function clearCanvas() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

}

function gameLoop() {


    clearCanvas();
    drawObject(player);
    updateEnemy();
    drawObject(enemy);
    requestAnimationFrame(gameLoop);
}


function updateEnemy() {

    const actions = calculateUtilities();
    const bestAction = actions.reduce((a, b) => a.utility > b.utility ? a : b);
    enemy.x += bestAction.dx * enemy.speed;
    enemy.y += bestAction.dy * enemy.speed;
}

function calculateUtilities() {

    const distances = [
        { dx: 1, dy: 0 }, //Move right
        { dx: -1, dy: 0 }, // Move left
        { dx: 0, dy: -1 }, // Move up
        { dx: 0, dy: 1 } // Move down
    ];

    return distances.map(action => ({

            ...action, 
            utility: calculateUtility(action.dx, action.dy)
    }));
}



function calculateUtility(dx, dy) {

    const nextX = enemy.x + dx * enemy.speed;
    const nextY = enemy.y + dy * enemy.speed;
    const distanceToPlayer = Math.hypot(nextX - player.x, nextY - player.y);
    return -distanceToPlayer; // We use negative because we want smaller distances to have higher utiltiy
 
}



document.addEventListener('keydown', (event) => {

    switch(event.key) {

        case 'ArrowUp':
                player.y -= 10;
                break;
        case 'ArrowDown':
                player.y += 10;
                break;
        case 'ArrowLeft':
                player.x -= 10;
                break;
        case 'ArrowRight':
                player.x += 10;
                break;

    }
});


requestAnimationFrame(gameLoop);