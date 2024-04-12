// import { RLAgent } from "./rl-agent";



const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');


class Player {

    constructor(x, y, game) {

        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.color = 'blue';
        this.game = game;
        this.speed = 4;
    }

    moveLeft() {

        this.x -= this.speed;
    }

    moveRight() {
        this.x += this.speed;

    }


    moveUp() {

        this.y -= this.speed;
    }

    moveDown() {

        this.y += this.speed;
    }

    draw() {
        this.game.ctx.fillStyle = this.color;
        this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
        
    }

}



class Enemy {


    constructor(x, y, game) {

        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.color = 'red';
        this.game = game;
        this.speed = 1;
    }

    moveRandom() {

        const dx = Math.random() < 0.5 ? -this.speed : this.speed;
        const dy = Math.random() < 0.5 ? -this.speed : this.speed;
        this.x += dx;
        this.y += dy;

     }


     move(dx, dy) {
        this.x += dx;
        this.y += dy;
     }



    draw() {
        this.game.ctx.fillStyle = this.color;
        this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
    }


}



class Game {

    constructor(canvas, context) {

        this.canvas = canvas;
        this.ctx = context;
        this.player = new Player(400, 300, this);
        this.enemy = new Enemy(100, 100, this);
        this.lastTime = 0;

        this.rlAgent = new RLAgent(['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown']);




        // ADD EVENT LISTENERS

        document.addEventListener('keydown', (event) => {

            switch (event.key) {
                case "ArrowLeft":
                    this.player.moveLeft();
                    break;
                case "ArrowRight":
                    this.player.moveRight();
                    break;
                case "ArrowUp":
                    this.player.moveUp();
                    break;
                case "ArrowDown":
                    this.player.moveDown();
                    break;
            }

        })
        
    }



    update() {

        
        // Update the game state (player, enemy, etc.)
        // Handle player input, enemy AI, collisions, etc.

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const dx = this.player.x - this.enemy.x;
        const dy = this.player.y - this.enemy.y;
        const state = this.rlAgent.stateToString(dx, dy);
        const action = this.rlAgent.chooseAction(state);
        this.executeEnemyAction(action);
        const nextState = this.rlAgent.stateToString(this.player.x - this.enemy.x, this.player.y - this.enemy.y);
        const reward = this.calculateReward(dx, dy, nextState);
        this.rlAgent.updateQ(state, action, reward, nextState);


        this.player.draw();
        this.enemy.draw();
        requestAnimationFrame(this.update.bind(this));

    }


    executeEnemyAction(action) {
        switch (action) {
            case 'ArrowLeft': 
                this.enemy.move(-this.enemy.speed, 0);
                break;
            case 'ArrowRight':
                this.enemy.move(this.enemy.speed, 0);
                break;
            case 'ArrowUp':
                this.enemy.move(0, -this.enemy.speed);
                break;
            case 'ArrowDown':
                this.enemy.move(0, this.enemy.speed);
                break;

        }
            
    }


    calculateReward(dx, dy, nextState) {
        // Define reward calculation logic based on state transitions

        // Calculate the current distance between the enemy and the player
        const currentDistance = Math.hypot(dx, dy);


        // Extract the next distance from nextState
        const [nextDx, nextDy] = nextState.split(':').map(Number);
        const nextDistance = Math.hypot(nextDx, nextDy);

        // Check if the enemy caught the player

        const caughtPlayer = nextDistance < this.enemy.width;

        // Assign a large positive reward for catching the player
        if (caughtPlayer) {
            return 100;
        }

        // Punish/reward the agent based on distance change
        if (nextDistance < currentDistance) {

            return 1;
        } else if (nextDistance > currentDistance) {

            return -1;
        }


        // No change in distance, provide a neutral reward
        return 0;
    }


   
}


const game = new Game(canvas, ctx);
game.update();