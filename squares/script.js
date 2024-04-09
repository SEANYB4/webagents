let canvas = document.getElementById('myCanvas');
let context = canvas.getContext('2d');

class Game {


    constructor(canvas, context, width, height) {

        this.canvas = canvas;
        this.context = context;
        this.width = width;
        this.height = height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;


        this.player = new Player(this);

        

        // Event Listeners
        document.addEventListener('keydown', (e) => {

            switch (e.key) {

                case 'w':
                    this.player.y -= 5;
                    break;

                default:
                    break;
            }
        })



    }

    draw() {






    }

    update() {

        this.player.draw();


        
    }


    render() {


        requestAnimationFrame(this.update);
    }
}



class Player {



    constructor(game) {
        this.game = game;
        this.x = 50;
        this.y = 50;
        this.width = 50;
        this.height = 50;

    }



    draw() {

        this.game.context.fillRect(this.x, this.y, this.width, this.height);


    }

    update() {

        



    }
}


const game = new Game(canvas, context, 800, 600);
game.render();