import { width } from "./game";
import { Box, Polygon, Vector } from "collider2d";

export class Obstacle {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    //draw the obstacle
    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        if (this.isOutOfBounds()) {
            this.x = width + this.width;
        }
        this.x -= 2.5;
    }

    isOutOfBounds() {
        return this.x < -this.width;
    }

    getPolygon(): Polygon {
        return new Box(
            new Vector(this.x, this.y),
            this.width,
            this.height,
        ).toPolygon();
    }
}
