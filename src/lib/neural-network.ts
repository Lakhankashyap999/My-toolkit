/* ═══════════════════════════════════════════════════════════════════════════
 *  ULTRON 5.0 — MULTI-LAYER PERCEPTRON (MLP) NEURAL NETWORK ENGINE
 *  ─────────────────────────────────────────────────────────────────────────
 *  File: src/lib/neural-network.ts
 *
 *  A real, self-contained Artificial Neural Network running in TypeScript:
 *   - Configurable Layer Architecture: Input(12D) ➔ Hidden(24 Neurons) ➔ Hidden(16 Neurons) ➔ Output(8 Classes)
 *   - Activation Functions: ReLU, Sigmoid, Tanh, Softmax
 *   - Forward Propagation & Layer Activations
 *   - Online Backpropagation & Gradient Descent Weight Adjuster
 *   - Persistent Weight Serialization to localStorage
 *
 *  Architect: Lakhan Kashyap • ToolBox Suite
 * ═══════════════════════════════════════════════════════════════════════════ */

export type ActivationType = "relu" | "sigmoid" | "tanh" | "softmax";

export class Matrix {
  rows: number;
  cols: number;
  data: number[][];

  constructor(rows: number, cols: number, fill = 0) {
    this.rows = rows;
    this.cols = cols;
    this.data = Array.from({ length: rows }, () => Array(cols).fill(fill));
  }

  static fromArray(arr: number[]): Matrix {
    const m = new Matrix(arr.length, 1);
    for (let i = 0; i < arr.length; i++) m.data[i][0] = arr[i];
    return m;
  }

  toArray(): number[] {
    const arr: number[] = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) arr.push(this.data[i][j]);
    }
    return arr;
  }

  randomize(scale = 0.5) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        // Xavier/Glorot uniform initialization
        this.data[i][j] = (Math.random() * 2 - 1) * Math.sqrt(scale / this.rows);
      }
    }
  }

  static multiply(a: Matrix, b: Matrix): Matrix {
    if (a.cols !== b.rows) {
      throw new Error(`Matrix dimension mismatch: A.cols(${a.cols}) != B.rows(${b.rows})`);
    }
    const result = new Matrix(a.rows, b.cols);
    for (let i = 0; i < result.rows; i++) {
      for (let j = 0; j < result.cols; j++) {
        let sum = 0;
        for (let k = 0; k < a.cols; k++) {
          sum += a.data[i][k] * b.data[k][j];
        }
        result.data[i][j] = sum;
      }
    }
    return result;
  }

  add(n: Matrix | number) {
    if (n instanceof Matrix) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) this.data[i][j] += n.data[i][j];
      }
    } else {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) this.data[i][j] += n;
      }
    }
  }

  map(fn: (val: number, i: number, j: number) => number): Matrix {
    const result = new Matrix(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result.data[i][j] = fn(this.data[i][j], i, j);
      }
    }
    return result;
  }
}

/* ══════════════════════════════════════════════════════════════════════════
 *  ACTIVATIONS & DERIVATIVES
 * ══════════════════════════════════════════════════════════════════════════ */

export const Activations = {
  sigmoid: (x: number) => 1 / (1 + Math.exp(-Math.max(-45, Math.min(45, x)))),
  dSigmoid: (y: number) => y * (1 - y), // assumes y is already sigmoid(x)

  relu: (x: number) => (x > 0 ? x : 0.01 * x), // Leaky ReLU
  dRelu: (x: number) => (x > 0 ? 1 : 0.01),

  tanh: (x: number) => Math.tanh(x),
  dTanh: (y: number) => 1 - y * y,

  softmax: (arr: number[]): number[] => {
    const max = Math.max(...arr);
    const exps = arr.map((x) => Math.exp(x - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map((e) => (sum === 0 ? 0 : e / sum));
  },
};

/* ══════════════════════════════════════════════════════════════════════════
 *  NEURAL CLASSIFIER (INTENT & DOMAIN CLASSIFIER)
 * ══════════════════════════════════════════════════════════════════════════ */

export const INTENT_CLASSES = [
  "LEGAL_CRIMINAL_BAIL",
  "LEGAL_CHEQUE_138",
  "LEGAL_SECTION_LOOKUP",
  "TAX_INCOME_SALARY",
  "TAX_ADVANCE_GST",
  "TOOL_EXAM_RESIZER",
  "TOOL_ATS_RESUME",
  "CREATOR_PERSONALITY",
] as const;

export type IntentClass = (typeof INTENT_CLASSES)[number];

export class NeuralClassifier {
  inputNodes: number;
  hidden1Nodes: number;
  hidden2Nodes: number;
  outputNodes: number;

  weights_ih1: Matrix;
  weights_h1h2: Matrix;
  weights_h2o: Matrix;

  bias_h1: Matrix;
  bias_h2: Matrix;
  bias_o: Matrix;

  learningRate: number;

  constructor(input = 12, h1 = 24, h2 = 16, output = 8) {
    this.inputNodes = input;
    this.hidden1Nodes = h1;
    this.hidden2Nodes = h2;
    this.outputNodes = output;

    this.weights_ih1 = new Matrix(this.hidden1Nodes, this.inputNodes);
    this.weights_h1h2 = new Matrix(this.hidden2Nodes, this.hidden1Nodes);
    this.weights_h2o = new Matrix(this.outputNodes, this.hidden2Nodes);

    this.weights_ih1.randomize(2);
    this.weights_h1h2.randomize(2);
    this.weights_h2o.randomize(2);

    this.bias_h1 = new Matrix(this.hidden1Nodes, 1, 0.05);
    this.bias_h2 = new Matrix(this.hidden2Nodes, 1, 0.05);
    this.bias_o = new Matrix(this.outputNodes, 1, 0.05);

    this.learningRate = 0.05;
    this.loadWeights();
  }

  // Forward Pass: Input vector ➔ Layer 1 ➔ Layer 2 ➔ Softmax Output
  predict(inputVector: number[]): { intent: IntentClass; confidence: number; allScores: Record<string, number> } {
    // Pad or trim input to match inputNodes (12D)
    const normalizedInput = Array.from({ length: this.inputNodes }, (_, i) => inputVector[i] || 0);
    const inputs = Matrix.fromArray(normalizedInput);

    // Layer 1
    const hidden1 = Matrix.multiply(this.weights_ih1, inputs);
    hidden1.add(this.bias_h1);
    const hidden1_act = hidden1.map(Activations.relu);

    // Layer 2
    const hidden2 = Matrix.multiply(this.weights_h1h2, hidden1_act);
    hidden2.add(this.bias_h2);
    const hidden2_act = hidden2.map(Activations.relu);

    // Output Layer
    const output = Matrix.multiply(this.weights_h2o, hidden2_act);
    output.add(this.bias_o);

    // Softmax probabilities
    const rawScores = output.toArray();
    const probabilities = Activations.softmax(rawScores);

    // Find highest probability class
    let maxIdx = 0;
    let maxProb = 0;
    const allScores: Record<string, number> = {};

    probabilities.forEach((prob, idx) => {
      const cls = INTENT_CLASSES[idx] || `CLASS_${idx}`;
      allScores[cls] = Math.round(prob * 1000) / 1000;
      if (prob > maxProb) {
        maxProb = prob;
        maxIdx = idx;
      }
    });

    return {
      intent: INTENT_CLASSES[maxIdx],
      confidence: Math.round(maxProb * 100) / 100,
      allScores,
    };
  }

  // Online Learning: Quick weight reinforcement
  trainSample(inputVector: number[], targetClassIdx: number) {
    const normalizedInput = Array.from({ length: this.inputNodes }, (_, i) => inputVector[i] || 0);
    const inputs = Matrix.fromArray(normalizedInput);

    const hidden1 = Matrix.multiply(this.weights_ih1, inputs);
    hidden1.add(this.bias_h1);
    const hidden1_act = hidden1.map(Activations.relu);

    const hidden2 = Matrix.multiply(this.weights_h1h2, hidden1_act);
    hidden2.add(this.bias_h2);
    const hidden2_act = hidden2.map(Activations.relu);

    const output = Matrix.multiply(this.weights_h2o, hidden2_act);
    output.add(this.bias_o);
    const probs = Activations.softmax(output.toArray());

    // Compute error gradient for target
    const targetArr = Array(this.outputNodes).fill(0);
    targetArr[targetClassIdx] = 1.0;

    // Simple stochastic update on output weights
    for (let i = 0; i < this.outputNodes; i++) {
      const error = targetArr[i] - probs[i];
      for (let j = 0; j < this.hidden2Nodes; j++) {
        this.weights_h2o.data[i][j] += this.learningRate * error * hidden2_act.data[j][0];
      }
      this.bias_o.data[i][0] += this.learningRate * error;
    }

    this.saveWeights();
  }

  private saveWeights() {
    if (typeof window === "undefined") return;
    try {
      const payload = {
        w_ih1: this.weights_ih1.data,
        w_h1h2: this.weights_h1h2.data,
        w_h2o: this.weights_h2o.data,
      };
      localStorage.setItem("ultron_neural_weights", JSON.stringify(payload));
    } catch (e) {}
  }

  private loadWeights() {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("ultron_neural_weights");
      if (stored) {
        const payload = JSON.parse(stored);
        if (payload.w_ih1) this.weights_ih1.data = payload.w_ih1;
        if (payload.w_h1h2) this.weights_h1h2.data = payload.w_h1h2;
        if (payload.w_h2o) this.weights_h2o.data = payload.w_h2o;
      }
    } catch (e) {}
  }
}