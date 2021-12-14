import * as _ from "lodash";
import { game, height } from "./game";
import { Box, Polygon, Vector } from "collider2d";
import { Obstacle } from "./obstacle";
import { NN } from "./nn";

export class Player {
    static width: number = 20;
    static height: number = 20;

    x: number;
    y: number;

    gravity: number = 0.8;
    lift: number = -24;
    velocity: number = 0;
    isDead: boolean;

    brain: NN;
    fitness: number = 0;

    constructor(x: number, y: number, brain: NN = null) {
        this.x = x;
        this.y = y;

        //this.x
        //closest.x
        //this.y
        //closest.y
        if (brain != null) {
            this.brain = brain;
        } else {
            this.brain = new NN(4, 4, 2);
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.isDead) return;

        ctx.fillStyle = "blue";
        //set opacity to 0.5
        ctx.globalAlpha = 0.4;
        ctx.fillRect(this.x, this.y, Player.width, Player.height);
        ctx.globalAlpha = 1;
    }

    update() {
        if (this.isDead) return;

        this.velocity += this.gravity;
        this.y += this.velocity;
        this.y = _.clamp(this.y, 0, height - Player.height);
        //clamp velocity
        this.velocity = _.clamp(this.velocity, -12, 12);

        this.fitness++;

        let closestDistance = Infinity;
        let closestObstacle: Obstacle = null;

        for (let obstacle of game.obstacles) {
            let distance = obstacle.x - this.x;
            if (distance < closestDistance) {
                closestDistance = distance;
                closestObstacle = obstacle;
            }
        }
        const inputs = [this.x, closestObstacle.x, this.y, closestObstacle.y];
        const outputs = this.brain.predict(inputs);
        if (outputs[0] > outputs[1]) {
            this.jump();
        }
    }

    jump() {
        if (this.isDead) return;
        if (this.y != height - Player.height) return;
        this.velocity += this.lift;
    }

    getPolygon(): Polygon {
        return new Box(
            new Vector(this.x, this.y),
            Player.width,
            Player.height,
        ).toPolygon();
    }
}
