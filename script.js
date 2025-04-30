let num1 = null;
// let num2 = null;
let currentOperation = null;
let displayValue = '0';
let shouldResetDisplay = false;

const buttonValues = [
    "1", "2", "3", "/", 
    "4", "5", "6", "*", 
    "7", "8", "9", "-", 
    "0", ".", "=", "+",
    "Clear", "Delete"
];

const calculator = document.querySelector('#calculator');
const buttonContainer = document.querySelector('.calc-buttons');

const display = document.createElement('div');
display.classList.add('calc-display');
display.id = 'calc-display';
display.textContent = displayValue;
calculator.prepend(display);

function updateDisplay() {
    if (displayValue.toString().length > 10 && displayValue.toString().includes('.')) {
        displayValue = parseFloat(displayValue).toFixed(8);
    }
    display.textContent = displayValue;
}

function inputDigit(digit) {
    if (shouldResetDisplay) {
        displayValue = digit;
        shouldResetDisplay = false;
    } else {
        displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
    updateDisplay();
}

function inputDecimal() {
    if (shouldResetDisplay) {
        displayValue = '0.';
        shouldResetDisplay = false;
    } else if (!displayValue.includes('.')) {
        displayValue += '.';
    }
    updateDisplay();
}

function handleOperator(operator) {
    const inputValue = parseFloat(displayValue);

    if (num1 !== null && currentOperation !== null && !shouldResetDisplay) {
        const result = operate(num1, inputValue, currentOperation);
        displayValue = result;
        num1 = result;
    } else {
        num1 = inputValue;
    }
    shouldResetDisplay = true;
    currentOperation = operator;
    updateDisplay();
}

function handleEquals() {
    if (num1 === null || currentOperation === null || shouldResetDisplay) {
        return;
    }
    const num2 = parseFloat(displayValue);
    const result = operate(num1, num2, currentOperation);
    
    displayValue = result;
    num1 = null;
    currentOperation = null;
    shouldResetDisplay = true;
    updateDisplay();
}

function clearCalculator() {
    displayValue = '0';
    num1 = null;
    currentOperation = null;
    shouldResetDisplay = false;
    updateDisplay();
}

function deleteLastDigit() {
    if (displayValue.length > 1) {
        displayValue = displayValue.slice(0, -1);
    } else {
        displayValue = '0';
    }
    updateDisplay();
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) return "Can't divide by 0";
    return a / b;
}

function buttonClick(e) {
    const buttonValue = e.target.dataset.value;

    if (!isNaN(buttonValue) || buttonValue === ".") {
        if (displayValue === '0' && buttonValue !== '.') {
            displayValue = buttonValue;
        } else {
            displayValue += buttonValue;
        }
    }

    else if (buttonValue === 'Clear') {
        displayValue = '0';
    }
    else if (buttonValue === 'Delete') {
        if (displayValue.length > 1) {
            displayValue = displayValue.slice(0, -1);
        } else {
            displayValue = '0';
        }
    }
    display.textContent = displayValue;
}

function operate(a, b, operation) {
    switch (operation) {
        case "+":
            return add(a, b);
        case "-":
            return subtract(a, b);
        case "*":
            return multiply(a, b);
        case "/":
            return divide(a, b);
        default:
            return b;
    }
}

buttonValues.forEach(value => {
    const button = document.createElement("button");
    button.classList.add('calc-button');
    button.textContent = value;
    // special case: clear is set to 'btnClear' & delete is set to 'btnDelete'
    const lower = value.toLowerCase();
    const buttonId = lower === "clear" ? "btnClear" : 
                    lower === "delete" ? "btnDelete" : `btn${value}`;
    button.dataset.value = value;
    button.id = buttonId;
    buttonContainer.appendChild(button);

    button.addEventListener('click', () => {
        if (value === "Clear") {
            clearCalculator();
        } else if (value === "Delete") {
            deleteLastDigit();
        } else if (value === "=") {
            handleEquals();
        } else if (["+", "-", "*", "/"].includes(value)) {
            handleOperator(value);
        } else if (value === ".") {
            inputDecimal();
        } else {
            inputDigit(value);
        }
    });
});