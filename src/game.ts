import { Player } from "./player";
import { Obstacle } from "./obstacle";
import { Collider2d } from "collider2d";
import { NN } from "./nn";

const math = require("mathjs");

export const width: number = 400;
export const height: number = 200;

const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;

canvas.width = width;
canvas.height = height;

const ctx = canvas.getContext("2d");

let timer: NodeJS.Timer;

let genSizes = 100;

class Game {
    // player: Player;
    players: Player[] = [];
    obstacles: Array<Obstacle> = [];

    constructor() {
        for (let i = 0; i < genSizes; i++) {
            this.players.push(new Player(25, height - Player.height));
        }

        //create all obstacles
        this.createObstacle();

        this.createObstacle(150 * 1);
        this.createObstacle(150 * 2);
        this.createObstacle(150 * 3);
    }

    gameLoop(): void {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, width, height);

        for (const obstacle of this.obstacles) {
            obstacle.draw(ctx);
            obstacle.update();
        }

        let allDead = true;

        for (const player of this.players) {
            if (player.isDead) {
                continue;
            }
            //loop over obstacles
            for (const obstacle of this.obstacles) {
                const obstacleCollider = obstacle.getPolygon();
                const playerCollider = player.getPolygon();

                if (
                    collider2d.testPolygonPolygon(
                        playerCollider,
                        obstacleCollider,
                    )
                ) {
                    player.isDead = true;
                }

                if (!player.isDead) {
                    allDead = false;
                }
            }

            player.update();
            player.draw(ctx);
        }

        if (allDead) {
            console.log("new game");
            this.nextGen();
        }
    }
    nextGen(): void {
        let bestFitness = Infinity;
        let bestPlayer: Player;

        for (const player of this.players) {
            if (player.fitness < bestFitness) {
                bestFitness = player.fitness;
                bestPlayer = player;
            }
        }
        if (bestPlayer) {
            console.log("best player fitness: " + bestPlayer.fitness);
            console.log("best player: " + bestPlayer.brain.toString());

            this.obstacles = [];
            //create all obstacles
            this.createObstacle();

            this.createObstacle(150 * 1);
            this.createObstacle(150 * 2);
            this.createObstacle(150 * 3);

            const bestBrain = bestPlayer.brain.clone();
            this.players = [];

            for (let i = 0; i < genSizes; i++) {
                this.players.push(new Player(25, height - Player.height));
            }

            this.players[1].brain = new NN(
                bestBrain.num_input_nodes,
                bestBrain.num_hidden_nodes,
                bestBrain.num_output_nodes,
            );

            for (let i = 2; i < this.players.length; i++) {
                this.players[i].brain.mutate(0.15);
            }
        }
    }

    onKeyDown(e: KeyboardEvent): void {
        if (e.keyCode === 32) {
            for (const player of this.players) {
                player.jump();
            }
        }
    }

    createObstacle(offsetX: number = 0): void {
        this.obstacles.push(
            new Obstacle(width - 25 + offsetX, height - 25, 14, 25),
        );
    }
}

export let game = new Game();
export const collider2d = new Collider2d();

//add a key listener for the space bar
window.addEventListener("keydown", function (e: KeyboardEvent) {
    game.onKeyDown(e);
});

//call game loop every 1/60th of a second
timer = setInterval(() => {
    game.gameLoop();
}, 1000 / 60);

// for (let i = 0; i < 250; i++) {
//     const nn = new NN(3, 2, 1);
//
//     console.log(nn.predict([5, 10, 20])[0]);
// }
