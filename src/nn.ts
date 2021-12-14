const math = require("mathjs");
import { Matrix } from "mathjs";

export class NN {
    num_input_nodes: number;
    num_hidden_nodes: number;
    num_output_nodes: number;

    weights_ih: any;
    weights_ho: any;

    bias_h: any;
    bias_o: any;

    constructor(
        num_input_nodes: number,
        num_hidden_nodes: number,
        num_output_nodes: number,
    ) {
        this.num_input_nodes = num_input_nodes;
        this.num_hidden_nodes = num_hidden_nodes;
        this.num_output_nodes = num_output_nodes;

        this.weights_ih = math.random(
            [num_hidden_nodes, num_input_nodes],
            -1.0,
            1.0,
        );
        this.weights_ho = math.random(
            [num_output_nodes, num_hidden_nodes],
            -1.0,
            1.0,
        );

        this.bias_h = math.random([num_hidden_nodes, 1], -1.0, 1);
        this.bias_o = math.random([num_output_nodes, 1], -1.0, 1);
    }

    predict(input_array: any): Array<number> {
        const inputs = arrayToMatrix(input_array);

        let hidden = math.multiply(this.weights_ih, inputs);
        hidden = math.add(hidden, this.bias_h);

        hidden = math.map(hidden, (i: any) => {
            return sigmoid(i);
        });

        let output = math.multiply(this.weights_ho, hidden);
        output = math.add(output, this.bias_o);
        output = math.map(output, (i: any) => {
            return sigmoid(i);
        });

        let result: Array<number> = [];

        math.map(output, (i: number) => result.push(i));
        return result;
    }

    clone(): NN {
        const nn = new NN(
            this.num_input_nodes,
            this.num_hidden_nodes,
            this.num_output_nodes,
        );
        nn.weights_ih = math.clone(this.weights_ih);
        nn.weights_ho = math.clone(this.weights_ho);
        nn.bias_h = math.clone(this.bias_h);
        nn.bias_o = math.clone(this.bias_o);
        return nn;
    }
    mutate(rate: number) {
        this.weights_ih = math.map(this.weights_ih, (i: any) => {
            if (math.random() < rate) {
                return math.random(-1.0, 1.0);
            }
            return i;
        });
        this.weights_ho = math.map(this.weights_ho, (i: any) => {
            if (math.random() < rate) {
                return math.random(-1.0, 1.0);
            }
            return i;
        });
        this.bias_h = math.map(this.bias_h, (i: any) => {
            if (math.random() < rate) {
                return math.random(-1.0, 1.0);
            }
            return i;
        });
        this.bias_o = math.map(this.bias_o, (i: any) => {
            if (math.random() < rate) {
                return math.random(-1.0, 1.0);
            }
            return i;
        });
    }
}

export function sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
}

export function arrayToMatrix(inputs: Array<any>) {
    const array = [];
    for (const val of inputs) {
        array.push([val]);
    }
    return math.matrix(array, "dense");
}
