function* filter(source) {
    for (let char of source) {
        if (/[><\.,\+\-\[\]]/.exec(char)) {
            yield char;
        }
    }
}

class Operation {
    constructor(type) {
        this.type = type;
    }
    append(op) {
        return false;
    }
    execute({pc, dp, data, inp, out, maxMemory}) {
        throw "[BUG] unimplemented operation!";
    }
}

class DataOp extends Operation {
    constructor() {
        super("data");
        this.amount = 0;
    }
    append(op) {
        if (op === "+") {
            this.amount++;
        } else if (op === "-") {
            this.amount--;
        } else {
            return false;
        }
        return true;
    }
    execute({pc, dp, data, inp, out, maxMemory}) {
        data[dp] = ((data[dp]|0) + this.amount)&255;
    }
}

class CellOp extends Operation {
    constructor() {
        super("cell");
        this.amount = 0;
    }
    append(op) {
        if (op === ">") {
            this.amount++;
        } else if (op === "<") {
            this.amount--;
        } else {
            return false;
        }
        return true;
    }
    execute(context) {
        let dp = context.dp += this.amount;
        if (dp < 0) {
            throw "invalid adress: " + dp;
        } else if (dp >= context.maxMemory && context.maxMemory !== -1) {
            throw "out of memory";
        }
    }
}

class InputOp extends Operation {
    constructor() {
        super("IN");
    }
    execute({pc, dp, data, inp, out, maxMemory}) {
        data[dp] = inp();
    }
}

class OutputOp extends Operation {
    constructor() {
        super("OUT");
    }
    execute({pc, dp, data, inp, out, maxMemory}) {
        out(data[dp] |= 0);
    }
}

class JumpOp extends Operation {
    constructor(target = -1) {
        super("jump");
        this.target = target;
    }
    execute(context) {
        if (context.pc < this.target === (context.data[context.dp] === 0)) {
            context.pc = this.target;
        }
    }
}

function compress(stream) {
    let brackets = [];
    let code = [];
    let partialOp = null;
    for (op of stream) {
        if (partialOp) {
            if (partialOp.append(op)) {
                continue;
            } else {
                code.push(partialOp);
                partialOp = null;
            }
        }
        if (op === "[") {
            let jump = new JumpOp();
            brackets.push({ op : jump, loc : code.length});
            code.push(jump);
        }
        else if (op === "]") {
            if (!brackets.length) {
                throw "unmatched closing bracket";
            }
            let {op : prev, loc : ploc} = brackets.pop();
            prev.target = code.length;
            let back = new JumpOp(ploc);
            code.push(back);
        }
        else if (op === "+" || op === "-") {
            partialOp = new DataOp();
            partialOp.append(op)
        }
        else if (op === ">" || op === "<") {
            partialOp = new CellOp();
            partialOp.append(op)
        }
        else if (op === ",") {
            code.push(new InputOp());
        } else if (op === ".") {
            code.push(new OutputOp())
        }
    }
    if (brackets.length) {
        throw "unmatched opening brackets"
    }
    if (partialOp) {
        code.push(partialOp);
    }
    return code
}

function compile(source) {
    let tokenstream = filter(source);
    let operations = compress(tokenstream);
    return operations;
}

function execute(code, input, output, executionSteps, maxMemory) {
    let context = {pc : 0, dp : 0, data : [], inp : input, out : output, maxMemory : maxMemory};
    for (; context.pc < code.length && (executionSteps > 0 || executionSteps === -1); --executionSteps, context.pc++) {
        code[context.pc].execute(context);
    }
    if (context.pc < code.length) {
        throw "used up computation time"
    }
}

function runWithText(source, inputText, steps, memoryLimit, outputLimit) {
    let code = compile(source);
    let inputLoader;
    {
        let ind = 0;
        inputLoader = x => {
            if (ind >= inputText.length) {
                return 0;
            } else {
                return inputText.charCodeAt(ind++);
            }
        }
    }
    let output = "";
    let outputWriter = x => {
        if (output.length >= outputLimit) {
            throw "out of string output";
        } else {
            output += String.fromCharCode(x);
        }
    }
    execute(code, inputLoader, outputWriter, steps, memoryLimit);
    return output;
}

module.exports = {
    compile : compile,
    execute : execute,
    runWithText : runWithText,
}