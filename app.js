const calculator = document.querySelector("#calculator");
const keys = calculator.querySelector("#keys-container");
const display = document.querySelector("#calculator-display");
const toggle = document.querySelector("#toggle-switch");
const toggleBtns = document.querySelectorAll(".header__theme-toggle-btn");
const toggleBtnsArray = Array.from(toggleBtns);
const toggleSwitch1 = document.querySelector("#switch-1");
const toggleSwitch2 = document.querySelector("#switch-2");
const toggleSwitch3 = document.querySelector("#switch-3");

localStorage = window.localStorage;
const getTheme = (() => {
  let savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.body.classList.remove("defaultTheme");
    document.body.classList.add(savedTheme);

    toggleBtnsArray.forEach(btn => {
      if (!btn.classList.contains(`-${savedTheme}`)) {
        return btn.classList.add("-display-none");
      }
      btn.classList.remove("-display-none");
    });
  }
})();

const calculate = (val1, operator, val2) => {
  const value1 = parseFloat(val1);
  const value2 = parseFloat(val2);

  if (operator === "add") {
    return value1 + value2;
  }
  if (operator === "substract") {
    return value1 - value2;
  }
  if (operator === "multiply") {
    return value1 * value2;
  }
  if (operator === "divide") {
    return value1 / value2;
  }
};

keys.addEventListener("click", e => {
  e.preventDefault();
  if (e.target.matches("button")) {
    const key = e.target;
    const operation = key.dataset.operation;
    const keyContent = key.textContent;
    let displayedNumber = display.textContent;

    Array.from(key.parentNode.children).forEach(key => {
      key.classList.remove("-is-pressed");
    });

    const previousKeyType = calculator.dataset.previousKeyType;

    if (!operation) {
      if (
        displayedNumber === "0" ||
        previousKeyType === "operator" ||
        previousKeyType === "calculate"
      ) {
        return (display.textContent = keyContent);
      }
      return (display.textContent = displayedNumber + keyContent);

      calculator.dataset.previousKeyType = "number";
    }

    if (
      operation === "add" ||
      operation === "substract" ||
      operation === "multiply" ||
      operation === "divide"
    ) {
      const firstValue = calculator.dataset.firstValue;
      const operator = calculator.dataset.operator;
      const secondValue = displayedNumber;

      if (
        firstValue &&
        operator &&
        previousKeyType !== "operator" &&
        previousKeyType !== "calculate"
      ) {
        const calcValue = calculate(firstValue, operator, secondValue);
        display.textContent = calcValue;
        return (calculator.dataset.firstValue = calcValue);
      } else {
        calculator.dataset.firstValue = displayedNumber;
      }

      key.classList.add("-is-pressed");
      calculator.dataset.previousKeyType = "operator";
      calculator.dataset.operator = operation;
    }

    if (operation === "decimal") {
      if (!displayedNumber.includes(".") && previousKeyType !== "operator") {
        display.textContent = displayedNumber + ".";
      } else if (
        previousKeyType === "operator" ||
        previousKeyType === "calculate"
      ) {
        display.textContent = "0.";
      }
      calculator.dataset.previousKeyType = "decimal";
    }

    if (operation === "delete") {
      if (displayedNumber.length > 1) {
        const currentNumber = displayedNumber;
        let newNumber = currentNumber.slice(0, -1);
        display.textContent = newNumber;
      } else if (displayedNumber !== "0") {
        display.textContent = "0";
      }

      calculator.dataset.previousKeyType = "delete";
    }

    if (operation === "reset") {
      calculator.dataset.firstValue = "";
      calculator.dataset.operator = "";
      calculator.dataset.oldSecondValue = "";
      calculator.dataset.previousKeyType = "";

      display.textContent = 0;
      calculator.dataset.previousKeyType = "reset";
    }

    if (operation === "calculate") {
      let firstValue = calculator.dataset.firstValue;
      const operator = calculator.dataset.operator;
      let secondValue = displayedNumber;

      if (firstValue) {
        if (previousKeyType === "calculate") {
          firstValue = displayedNumber;
          secondValue = calculator.dataset.oldSecondValue;
        }
        display.textContent = calculate(firstValue, operator, secondValue);
      }
      calculator.dataset.oldSecondValue = secondValue;
      calculator.dataset.previousKeyType = "calculate";
    }
  }
});

const toggleTheme = () => {
  const element = document.body;

  if (element.classList.contains("defaultTheme")) {
    element.classList.remove("defaultTheme");
    element.classList.add("lightTheme");
    toggleSwitch1.classList.add("-display-none");
    toggleSwitch2.classList.remove("-display-none");
    localStorage.setItem("theme", "lightTheme");
    return;
  }
  if (element.classList.contains("lightTheme")) {
    element.classList.remove("lightTheme");
    toggleSwitch2.classList.add("-display-none");
    toggleSwitch3.classList.remove("-display-none");
    element.classList.add("darkTheme");
    localStorage.setItem("theme", "darkTheme");
    return;
  }

  element.classList.remove("darkTheme");
  element.classList.add("defaultTheme");
  toggleSwitch3.classList.add("-display-none");
  toggleSwitch1.classList.remove("-display-none");
  localStorage.setItem("theme", "defaultTheme");
};

toggle.addEventListener("click", toggleTheme);


