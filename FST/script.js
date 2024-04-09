// Get the canvas element and context
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');




class Game {


    constructor(canvas, ctx) {

        this.canvas = canvas;
        this.canvas.width = 1000;
        this.canvas.height = 1000;
        this.ctx = ctx;
        this.player = new Player(50, 50, this);
        this.states = {
                            WANDER: 'wander',
                            CHASE: 'chase',
                            ATTACK: 'attack',
                            FLEE: 'flee'
                      };
        this.enemy = new Enemy(250, 250, this);



        // FPS
        this.fps = 30;
        this.fpsInterval = 1000/ this.fps;
        this.then = Date.now();



        // Event Handling


        // Listen for key down events
        document.addEventListener('keydown', (e) => {


            switch (e.key) {


                case 'ArrowUp':
                    this.player.setDirection(0, -1);
                    break;
                case 'ArrowDown':
                    this.player.setDirection(0, 1);
                    break;
                case 'ArrowLeft':
                    this.player.setDirection(-1, 0);
                    break;
                case 'ArrowRight':
                    this.player.setDirection(1, 0);
                    break;
                case ' ':
                    this.player.attack();
                    break;
            }
        });
                      
        // Listen for key up events

        document.addEventListener('keyup', (e) => {

            switch(e.key) {

                case 'ArrowUp':
                    this.player.setDirection(0, 0);
                    break;
                case 'ArrowDown':
                    this.player.setDirection(0, 0);
                    break;
                case 'ArrowLeft':
                    this.player.setDirection(0, 0);
                    break;
                case 'ArrowRight':
                    this.player.setDirection(0, 0);
                    break;
            }
        });


    }





    update() {

        // FPS
        const now = Date.now();
        const elapsed = now - this.then;

        if (elapsed > this.fpsInterval) {

            // Clear canvas
            ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);
                        
            this.player.update(); // Update player position
            this.player.render();

            // Update enemy state and position based on player's position
            this.enemy.update({ x: this.player.x, y: this.player.y });
            this.enemy.render();



            // Draw health bars

            ctx.font = '30px Monospace';
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            let posx = 730;
            let posy = 50;
            ctx.fillText('Player:', posx, posy);

            this.ctx.fillStyle = 'blue';
            this.ctx.fillRect(800, 10, (this.player.health/100)*100, 50);


            ctx.font = '30px Monospace';
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            posx = 740;
            posy = 115;
            ctx.fillText('Enemy:', posx, posy);


            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(800, 80, (this.enemy.health/100)*100, 50);


            // Check for game over

            if (this.player.health <= 0) {
                console.log('GAME OVER!!!');
                ctx.font = '30px Monospace';
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                let posx = this.canvas.width/2;
                let posy = this.canvas.height/2;
                ctx.fillText('GAME OVER!!!', posx, posy);
                return;
            }



            // Check for game win

            if (this.enemy.health <= 0) {
                console.log('YOU WIN!!!');
                ctx.font = '30px Monospace';
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                let posx = this.canvas.width/2;
                let posy = this.canvas.height/2;
                ctx.fillText('YOU WIN!!!', posx, posy);
                return;
            }
        }

        requestAnimationFrame(this.update.bind(this));
    }


}




class Player {

    constructor(x, y, game) {

        this.x = x;
        this.y = y;
        this.game = game;
        this.speed = 3;
        this.direction = { x: 0, y: 0};
        this.health = 100;
        this.hitRange = 10;

    }

    // Handle player input to update direction

    setDirection(x, y) {

        this.direction.x = x;
        this.direction.y = y;

    }


    attack() {

        console.log("ATTACK");

        let enemyX = this.game.enemy.x;
        let enemyY = this.game.enemy.y;

        let distanceToEnemy = Math.hypot(this.x - enemyX, this.y - enemyY);

        if (distanceToEnemy < this.hitRange) {

            this.game.enemy.health -= 80;
        }

        this.game.ctx.fillStyle = 'yellow';
        this.game.ctx.fillRect(this.x - this.hitRange, this.y - this.hitRange, 70, 70);


    }


    // Update player position based on direction

    update() {

        if (this.x >= 0 && this.x <= this.game.canvas.width) {
            this.x += this.direction.x * this.speed;
        } else {
            this.x = 1;
        }
        
        if (this.y >= 0 && this.y <= this.game.canvas.height) {
            this.y += this.direction.y * this.speed;
        } else {
            this.y = 1;
        }
        
    }


    render() {

        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, 50, 50);
    }
}

class Enemy {

    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.game = game;
        this.state = this.game.states.WANDER;
        this.hitRange = 10;
        this.health = 100;

    }



    // Method to update the enemy's behavior based on its state


    update(playerPosition) {
        

        this.checkTransitions(playerPosition);

        switch (this.state) {


            case this.game.states.WANDER:
                this.wander();
                break;

            case this.game.states.CHASE:
                this.chase(playerPosition);
                break;

            case this.game.states.ATTACK:
                this.attack(playerPosition);
                break;

            case this.game.states.FLEE:
                this.flee(playerPosition);
                break;
            
        }

        if (this.health < 0) {
            this.health = 0;
        }
    }

    // State methods

    wander() {

        // Implement wandering behavior
        let randomX = Math.random()*8;
        let randomY = Math.random()*8;
        let sign = Math.random();
        let sign2 = Math.random();

        if (sign < 0.5) {
            this.x -= randomX;

        } else {
            this.x += randomX;
        }

        if (sign2 < 0.5) {

            this.y -= randomY;
        } else {
            this.y += randomY;
        }


        if (this.x <= 0) {
            this.x = 1;
        }

        if (this.y <= 0) {
            this.y = 1;
        }


    }


    chase(playerPosition) {


        // Implement chasing behavior


        const chaseSpeed = 1.5;
        const dx = playerPosition.x - this.x;
        const dy = playerPosition.y - this.y;
        const distance = Math.sqrt(dx * dx +  dy * dy);

        if (distance > 1) {

            this.x += (dx / distance) * chaseSpeed;
            this.y += (dy / distance) * chaseSpeed;
        }
    }


    attack(playerPosition) {

        // Implement attacking behavior
        // Move towards the player's position at a faster speed than chase

        const attackSpeed = 2;
        const dx = playerPosition.x - this.x;
        const dy = playerPosition.y - this.y;
        const distance = Math.hypot(dx, dy);

        if (distance > 0) {
            // Avoid division by zero
            // Normalize the direction vector (dx, dy)

            const vx = (dx / distance) * attackSpeed;
            const vy = (dy / distance) * attackSpeed;


            // Move the enemy towards the player
            this.x += vx;
            this.y += vy;

        }

        // Check if the enemy is close enough to 'hit' the player

        
        if (distance < this.hitRange) {

            // Inflict damage on the player
            this.game.player.health -= 5;
            this.game.ctx.fillStyle = 'green';
            this.game.ctx.fillRect(this.x - this.hitRange, this.y - this.hitRange, 70, 70);
        }


    }



    flee(playerPosition) {

        // Implement fleeing behavior

        const fleeSpeed = 1.5;
        const dx = playerPosition.x - this.x;
        const dy = playerPosition.y - this.y;
        const distance = Math.sqrt(dx * dx +  dy * dy);

        if (distance > 1) {

            this.x -= (dx / distance) * fleeSpeed;
            this.y -= (dy / distance) * fleeSpeed;
        }



        if (this.x <= 0 || this.x >= this.game.canvas.width) {
            this.x = 1;
        }

        if (this.y <= 0 || this.y >= this.game.canvas.height) {
            this.y = 1;
        }

    }



    // Render the enemy on the canvas

    render() {

        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, 50, 50); // Simple square enemy
    }



    // Call this method to decide state transitions

    checkTransitions(playerPosition) {

        const distanceToPlayer = Math.hypot(this.x - playerPosition.x, this.y - playerPosition.y);

        // Example conditions for state transitions

        if (this.health <= 40) {
            this.state = this.game.states.FLEE;
        } else if (distanceToPlayer < 50) {
            this.state = this.game.states.ATTACK;
        } else if (distanceToPlayer < 200) {
            this.state = this.game.states.CHASE;
        } else {
            this.state = this.game.states.WANDER;
        }

        // Add more conditions as necessary
    }
}


const game = new Game(canvas, ctx);
game.update();