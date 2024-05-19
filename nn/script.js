const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');


let player = { x: 50, y: 50, size: 30, color: 'blue' };

let enemy = { x: 300, y: 300, size: 30, color: 'red', speed: 1 };



// Initialize the neural network
const nn = new NeuralNetwork(2, 6, 4); // 2 inputs, 6 hidden nodes, 4 outputs


function drawObject(obj) {
    ctx.fillStyle = obj.color;
    ctx.fillRect(obj.x, obj.y, obj.size, obj.size);

}

function clearCanvas(obj) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


function updateEnemy() {

    const inputs = [player.x - enemy.x, player.y - enemy.y];
    const outputs = nn.feedforward(inputs);
    const actionIndex = outputs.indexOf(Math.max(...outputs));
    console.log(actionIndex);
    moveEnemy(actionIndex);

}

function moveEnemy(actionIndex) {

    

    switch (actionIndex) {

        case 0: 
            enemy.y -= enemy.speed;
            break;
        case 1: 
            enemy.y += enemy.speed;
            break;
        case 2:
            enemy.x -= enemy.speed; 
            break;
        case 3:
            enemy.x += enemy.speed;
            break;
    }
}


function gameLoop() {


    clearCanvas();
    drawObject(player);
    updateEnemy();
    drawObject(enemy);
    requestAnimationFrame(gameLoop);

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


    // For simplicity, ise the player's position as training data
    const input = [player.x - enemy.x, player.y - enemy.y];
    const target = [0, 0, 0, 0]; // Create a target array based on player movement


    target[event.key === 'ArrowUp' ? 0 : event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' ? 2 : 3] = 1;
    nn.train(input, target);

})


requestAnimationFrame(gameLoop);