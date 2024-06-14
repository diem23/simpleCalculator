let result = 0; // biến để lưu phần kết quả chắc chắn ko đổi
let curValue = 0; // biến để lưu giá trị hiện tại
let curOperator = "none"; // biến để lưu toán tử hiện tại
let curOperand = 0; // biến để lưu toán hạng hiện tại (phần toán hạng này có thể thay đổi nêu sử dụng pri-operator)
let curOperand1 = "none"; // biến để lưu toán hạng hiện tại (phần toán hạng này có thể thay đổi nêu sử dụng pri-operator)
let operatorReminder = 1;
let haveDot = false;
let curDigitPart = 0;
// PART OF TOOLING FUNCTIONS
//function get type btn
function getTypeBtn(btn) {
    if (btn == "AC" || btn == "C" || btn == "=") {
        return "control";
    }
    if (btn == "+" || btn == "-") {
        return "nonpri-operator";
    }
    if (btn == "x" || btn == "/" || btn == "%") {
        return "pri-operator";
    }
    if (btn == ".") {
        return "dot";
    }
    if (btn == "+/-") {
        return "negative";
    }
    return "number";
}
// Function for cucumlating operator
function cucumlativeDisplay(text, removeLast = false) {
    if (removeLast) {
        let str = document.getElementById("input-user").innerHTML;
        document.getElementById("input-user").innerHTML =
            str.slice(0, -1) + text;
        return;
    }
    document.getElementById("input-user").innerHTML += text;
}
// Function to clear the input-user
function clearDisplay() {
    result = 0;
    curOperator = "none";
    operatorReminder = 1;
    curOperand = 0;
    curOperand1 = "none";
    curValue = 0;
    haveDot = false;
    curDigitPart = 0;
    document.getElementById("input-user").innerHTML = "0";
    hideCurrentValue();
}
// Function show result
function showResult() {
    //if (haveDot) curValue /= Math.pow(10, curDigitPart);
    if (curValue == Infinity) {
        console.log("Math Error");
        document.getElementById("input-user").innerHTML = "Math Error";
        hideCurrentValue();
        setTimeout(clearDisplay, 2000);
        return;
    }
    result = curValue;
    document.getElementById("input-user").innerHTML =
        result != Math.round(result) ? result.toFixed(4) : result;
    result = 0;
    curOperator = "none";
    curOperand1 = "none";
    operatorReminder = 1;
    curOperand = curValue;
    haveDot = false;
    curDigitPart = 0;
    hideCurrentValue();
}
// Function display current value
function displayCurrentValue() {
    document.getElementById("current-value").style.display = "block";
}
function updateCurrentValue() {
    document.getElementById("current-value").innerHTML =
        curValue != Math.round(curValue) ? curValue.toFixed(4) : curValue;
}
function hideCurrentValue() {
    document.getElementById("current-value").style.display = "none";
}
// Function operating two numbers
function operate(a, b, operator) {
    if (operator == "+") {
        return a + b;
    }
    if (operator == "-") {
        return a - b;
    }
    if (operator == "x") {
        return a * b;
    }
    if (operator == "/") {
        return a / b;
    }
    if (operator == "%") {
        return a % b;
    }
}
// PART OF FUNCTIONS HANDLING OPERATORS
// function handle nonpri-operator
function handleNonPriOperator(operator) {
    if (curOperator != "none" && curOperand1 == "none") {
        return false;
    }
    if (curOperand1 == "none") {
        if (haveDot) {
            curOperand /= Math.pow(10, curDigitPart);
            curDigitPart = 0;
            haveDot = false;
        }
        result += curOperand * operatorReminder;
        operatorReminder = 1;
        curOperator = operator;
        curOperand = 0;
        curValue = result;
    } else {
        if (haveDot) {
            curOperand1 /= Math.pow(10, curDigitPart);
            curDigitPart = 0;
            haveDot = false;
        }
        result +=
            operate(curOperand, curOperand1, curOperator) * operatorReminder;
        operatorReminder = 1;
        curOperator = operator;
        curOperand = 0;
        curOperand1 = "none";
        curValue = result;
    }
    cucumlativeDisplay(operator);
}
// function handle pri-operator
function handlePriOperator(operator) {
    //let typeBtn = getTypeBtn(operator);
    if (curOperator != "none" && curOperand1 == "none") return false;
    if (curOperand1 != "none") {
        if (haveDot) {
            curOperand1 /= Math.pow(10, curDigitPart);
            curDigitPart = 0;
            haveDot = false;
        }
        curOperand = operate(curOperand, curOperand1, curOperator);
        curOperator = operator;
        curOperand1 = "none";
        cucumlativeDisplay(operator);
    } else {
        if (haveDot) {
            curOperand /= Math.pow(10, curDigitPart);
            curDigitPart = 0;
            haveDot = false;
        }
        curOperator = operator;
        cucumlativeDisplay(operator);
    }
}
// function display negative operator
function displayNegative() {
    console.log("display negative");
    let str = document.getElementById("input-user").innerHTML;
    for (let i = str.length - 1; i >= 0; i--) {
        if (
            getTypeBtn(str[i]) == "nonpri-operator" ||
            getTypeBtn(str[i]) == "pri-operator"
        ) {
            if (str[i - 1] == "(") {
                str = str.slice(0, i - 1) + str.slice(i + 1, str.length - 1);
                document.getElementById("input-user").innerHTML = str;
            } else {
                str =
                    str.slice(0, i + 1) +
                    "(-" +
                    str.slice(i + 1, str.length) +
                    ")";
                document.getElementById("input-user").innerHTML = str;
            }
            return;
        }
    }
    str = "(-" + str + ")";
    document.getElementById("input-user").innerHTML = str;
}
//function handle number
function handleNumber(number) {
    if (curOperator != "none" && curOperand1 == "none") {
        if (curOperator == "+" || curOperator == "-") {
            operatorReminder = curOperator == "+" ? 1 : -1;
            curOperand = parseInt(number);
            curOperator = "none";
            curValue = result + curOperand * operatorReminder;
        } else {
            let temp = operate(curOperand, parseInt(number), curOperator);
            curOperand1 = parseInt(number);
            curValue = result + temp * operatorReminder;
        }
        cucumlativeDisplay(number);
    } else {
        if (haveDot) curDigitPart++;
        if (curOperand1 == "none") {
            cucumlativeDisplay(number, curOperand == 0 && !haveDot);
            curOperand =
                curOperand >= 0
                    ? curOperand * 10 + parseInt(number)
                    : curOperand * 10 - parseInt(number);
            curValue =
                result +
                (curOperand / Math.pow(10, curDigitPart)) * operatorReminder;
        } else {
            cucumlativeDisplay(number, curOperand1 == 0 && !haveDot);
            curOperand1 =
                curOperand1 >= 0
                    ? curOperand1 * 10 + parseInt(number)
                    : curOperand1 * 10 - parseInt(number);
            curValue =
                result +
                operate(
                    curOperand,
                    curOperand1 / Math.pow(10, curDigitPart),
                    curOperator
                );
        }
    }
    updateCurrentValue();
    return true;
}
// function handle dot
function handleDot() {
    if (haveDot || (curOperator != "none" && curOperand1 == "none"))
        return false;
    else {
        cucumlativeDisplay(".");
        haveDot = true;
        updateCurrentValue();
    }
}
// function handle negative
function handleNegative() {
    if (curOperator != "none" && curOperand1 == "none") return false;
    else {
        if (curOperand1 == "none") {
            //TH khoi tao
            curOperand *= -1;
            curValue =
                result +
                (curOperand / Math.pow(10, curDigitPart)) * operatorReminder;
        } else {
            curOperand1 *= -1;
            curValue =
                result +
                operate(
                    curOperand,
                    curOperand1 / Math.pow(10, curDigitPart),
                    curOperator
                ) *
                    operatorReminder;
        }
        displayNegative();
        updateCurrentValue();
    }
}
// function handle athrimetic operator
function handleArithmetic(btn) {
    let typeBtn = getTypeBtn(btn);
    if (typeBtn == "nonpri-operator") {
        return handleNonPriOperator(btn);
    } else if (typeBtn == "pri-operator") {
        return handlePriOperator(btn);
    } else if (typeBtn == "dot") {
        return handleDot();
    } else if (typeBtn == "negative") {
        return handleNegative();
    } else {
        return handleNumber(btn);
    }
}

// function handleing
function handle(btn) {
    let type = getTypeBtn(btn);
    console.log(type);
    if (type == "control") {
        if (btn == "AC") {
            clearDisplay();
        } else if (btn == "=") {
            showResult();
        }
    } else {
        handleArithmetic(btn);
        displayCurrentValue();
    }
    console.log("result: ", result);
    console.log("operatorReminder: ", operatorReminder);
    console.log("curOperand: ", curOperand);
    console.log("curOperator: ", curOperator);
    console.log("curValue: ", curValue);
    console.log("curOperand1: ", curOperand1);
}
let listBtn = document.querySelectorAll(".normal-btn");
console.log(listBtn);
listBtn.forEach((button) => {
    button.addEventListener("click", () => {
        console.log(button.innerHTML);
        handle(button.innerHTML);
    });
});
