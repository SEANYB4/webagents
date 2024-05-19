class NeuralNetwork {


    constructor(inputNodes, hiddenNodes, outputNodes) {


        this.inputNodes = inputNodes;
        this.hiddenNodes = hiddenNodes;
        this.outputNodes = outputNodes;


        // Initialize weights
        this.weightsIH = new Array(this.hiddenNodes).fill().map(() => new Array(this.inputNodes).fill().map(() => Math.random() * 2 - 1));
        this.weightsHO = new Array(this.outputNodes).fill().map(() => new Array(this.hiddenNodes).fill().map(() => Math.random() * 2 - 1));


        // Learning Rate

        this.learningRate = 0.1;

    }

    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }


    dsigmoid(y) {
        // derivative of sigmoid: y * (1 - y)
        return y * (1 - y);
    }

    feedforward(inputArray) {

        // Generating the hidden outputs
        let inputs = inputArray;
        let hidden = new Array(this.hiddenNodes).fill(0);


        for (let i = 0; i < this.hiddenNodes; i++) {

            let sum = 0;
            for (let j = 0; j < this.inputNodes; j++) {

                sum += this.weightsIH[i][j] * inputs[j];
                
            }
            hidden[i] = this.sigmoid(sum);
        }


        // Generating the output

        let outputs = new Array(this.outputNodes).fill(0);
        for (let i = 0; i < this.outputNodes; i++) {
            let sum = 0;
            for (let j = 0; j < this.hiddenNodes; j++) {
                sum += this.weightsHO[i][j] * hidden[j];
            }
            outputs[i] = this.sigmoid(sum);
        }

        return outputs;
    }



    train(inputArray, targetArray) {

        

        // Feed forward
        let inputs = inputArray;
        let hidden = new Array(this.hiddenNodes).fill(0);
        let outputs = new Array(this.outputNodes).fill(0);


        // Input to hidden
        for (let i = 0; i < this.hiddenNodes; i++) {

            let sum = 0;
            for (let j = 0; j < this.inputNodes; j++) {
                sum += this.weightsIH[i][j] * inputs[j];
            }
            hidden[i] = this.sigmoid(sum);

        }


        // Hidden to output

        for (let i = 0; i < this.outputNodes; i++) {

            let sum = 0;
            for (let j = 0; j < this.hiddenNodes; j++) {

                sum += this.weightsHO[i][j] * hidden[j];
            }
            outputs[i] = this.sigmoid(sum);
        }

        // Convert array to matrix objects
        // (not implemented here; for simplicity we use arrays)

        // Calculate error
        // Error = targets - outputs
        let outputErrors = new Array(this.outputNodes);
        for (let i = 0; i < this.outputNodes; i++) {
            outputErrors[i] = targetArray[i] - outputs[i];

        }


        // Calculate gradients
        let gradients = outputs.map((output, i) => this.dsigmoid(output) * outputErrors[i] * this.learningRate);


        // Calculate the deltas
        // let hidden_T = this.transpose(hidden);
        let weights_ho_deltas = this.matrixMultiply(gradients, hidden);

        // Adjust the weights by deltas
        for (let i = 0; i < this.outputNodes; i++) {

            for (let j = 0; j < this.hiddenNodes; j++) {

                this.weightsHO[i][j] += weights_ho_deltas[i][j];
            }
        }

        // Calculate the hidden layer errors
        let who_t = this.transpose(this.weightsHO);
        let hiddenErrors = this.matrixMultiply(who_t, outputErrors);


        // Calculate the hidden gradient
        let hiddenGradient = hidden.map((output, i) => this.dsigmoid(output) * hiddenErrors[i] * this.learningRate);

        // Calculate the input->hidden deltas
        let inputs_T = this.transpose(inputs);
        let weight_ih_deltas = this.matrixMultiply(hiddenGradient, inputs_T);


        // Adjust the input->hidden weights
        for (let i = 0; i < this.hiddenNodes; i++) {

            for (let j = 0; j < this.inputNodes; j++) {

                this.weightsIH[i][j] += weight_ih_deltas[i][j];
            }
        }
    }


    transpose(matrix) {

        if (!Array.isArray(matrix[0])) {
            return[matrix];
        }

        return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
    }


    matrixMultiply(a, b) {

        // Assuming a and b are 2D arrays
        let result = new Array(a.length).fill().map(() => new Array(b[0].length).fill(0));

        for (let i = 0; i < a.length; i++) {

            for (let j = 0; j < b[0].length; j++) {

                for (let k = 0; k < b.length; k++) {

                    result[i][j] += a[i][k] * b[k][j];
                }
            }
        }
        return result;
    }
}

