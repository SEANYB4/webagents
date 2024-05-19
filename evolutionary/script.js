const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');



let player = {

    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: 20
};



class Enemy {


    constructor(dna) {

        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = 10;
        this.dna = dna || {
            speed: Math.random() * 4 + 1, // Random speed between 1 and 5
        };
    }



    update() {

        // Simple AI: move towards the player
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        this.x += Math.cos(angle) * this.dna.speed;
        this.y += Math.sin(angle) * this.dna.speed;
    }



    draw() {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}


let enemies = Array.from({length: 20}, () => new Enemy());



// To evolve the enemies, you need to add fitness evaluation, selection, crossover, and mutation processes

function evolve() {

    // Evaluate fitness based on distance to player (closer is better)

    enemies.forEach(enemy => {
        enemy.fitness = 1 / (Math.hypot(enemy.x - player.x, enemy.y - player.y) + 1);
    });


    // Sort by fitness and select the top half
    enemies.sort((a, b) => b.fitness - a.fitness);
    enemies = enemies.slice(0, enemies.length / 2);





    // Crossover and mutate to refill population

    while (enemies.length < 20) {

        let parent = enemies[Math.floor(Math.random() * enemies.length)];
        let newDna = {
            speed: parent.dna.speed + (Math.random() * 5 - 1) // Small mutation
        };
        enemies.push(new Enemy(newDna));
    }
}


setInterval(evolve, 2000); // Evolve every 10 seconds



// Event listening


document.addEventListener('keydown', (e) => {


    switch(e.key) {

        case 'w':
            player.y -= 5;
            break;

        case 'a':
            player.x -= 5;
            break;

        case 's':
            player.y += 5;
            break;

        case 'd':
            player.x += 5;
            break;

        default:
            break;
    }

})






function gameLoop() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);



    // Draw player
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI*2);
    ctx.fill();




    // Update and draw enemies 
    enemies.forEach(enemy => {
        enemy.update();
        enemy.draw();
        console.log("Drawing enemy....");
    });


    requestAnimationFrame(gameLoop);
}



gameLoop();