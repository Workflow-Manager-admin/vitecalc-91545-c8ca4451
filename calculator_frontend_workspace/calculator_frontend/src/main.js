/* eslint-env browser */
/* global window */

import './style.css';

// PUBLIC_INTERFACE
function Calculator() {
  /**
   * Minimal in-browser calculator with all arithmetic operations.
   * This constructor initializes all element references, state, and events.
   */
  this.display = null;
  this.currentValue = '0';
  this.prevValue = null;
  this.operator = null;
  this.waitingForNewOperand = false;

  // PUBLIC_INTERFACE
  this.init = () => {
    document.querySelector('#app').innerHTML = `
      <div class="calculator-container">
        <div id="calculator-display" class="calculator-display">0</div>
        <div class="calculator-buttons">
          <button data-action="clear" class="btn function">AC</button>
          <button data-action="divide" class="btn operator">÷</button>
          <button data-action="multiply" class="btn operator">×</button>
          <button data-action="back" class="btn function">⌫</button>
          <button data-action="7" class="btn digit">7</button>
          <button data-action="8" class="btn digit">8</button>
          <button data-action="9" class="btn digit">9</button>
          <button data-action="subtract" class="btn operator">−</button>
          <button data-action="4" class="btn digit">4</button>
          <button data-action="5" class="btn digit">5</button>
          <button data-action="6" class="btn digit">6</button>
          <button data-action="add" class="btn operator">+</button>
          <button data-action="1" class="btn digit">1</button>
          <button data-action="2" class="btn digit">2</button>
          <button data-action="3" class="btn digit">3</button>
          <button data-action="equals" class="btn operator span-two">=</button>
          <button data-action="0" class="btn digit span-two">0</button>
          <button data-action="dot" class="btn digit">.</button>
        </div>
      </div>
    `;
    this.display = document.getElementById('calculator-display');
    this.setupEvents();
    this.updateDisplay();
  };

  // PUBLIC_INTERFACE
  this.setupEvents = () => {
    document.querySelectorAll('.calculator-buttons .btn').forEach((btn) => {
      btn.addEventListener('click', (e) => this.handleButtonClick(e.target.dataset.action));
    });
    document.addEventListener('keydown', this.handleKeyDown);
  };

  // PUBLIC_INTERFACE
  this.handleButtonClick = (action) => {
    if (!isNaN(action)) {
      this.inputDigit(action);
      return;
    }
    switch (action) {
      case 'dot':
        this.inputDot();
        break;
      case 'add':
      case 'subtract':
      case 'multiply':
      case 'divide':
        this.handleOperator(action);
        break;
      case 'equals':
        this.performCalculation();
        break;
      case 'clear':
        this.resetCalculator();
        break;
      case 'back':
        this.deleteLast();
        break;
      default:
        break;
    }
    this.updateDisplay();
  };

  // PUBLIC_INTERFACE
  this.handleKeyDown = (e) => {
    const keyMap = {
      '+': 'add',
      '-': 'subtract',
      '*': 'multiply',
      'x': 'multiply',
      '/': 'divide',
      '÷': 'divide',
      'Enter': 'equals',
      '=': 'equals',
      '.': 'dot',
      ',': 'dot',
      'Backspace': 'back',
      'Escape': 'clear',
    };
    if (e.key >= '0' && e.key <= '9') {
      e.preventDefault();
      this.inputDigit(e.key);
      this.updateDisplay();
    } else if (keyMap[e.key]) {
      e.preventDefault();
      this.handleButtonClick(keyMap[e.key]);
    }
  };

  // PUBLIC_INTERFACE
  this.inputDigit = (digit) => {
    if (this.waitingForNewOperand) {
      this.currentValue = digit;
      this.waitingForNewOperand = false;
    } else {
      this.currentValue = this.currentValue === '0' ? digit : this.currentValue + digit;
    }
  };

  // PUBLIC_INTERFACE
  this.inputDot = () => {
    if (this.waitingForNewOperand) {
      this.currentValue = '0.';
      this.waitingForNewOperand = false;
    } else if (!this.currentValue.includes('.')) {
      this.currentValue += '.';
    }
  };

  // PUBLIC_INTERFACE
  this.handleOperator = (operator) => {
    if (this.operator && !this.waitingForNewOperand) {
      this.performCalculation();
    }

    this.prevValue = this.currentValue;
    this.operator = operator;
    this.waitingForNewOperand = true;
  };

  // PUBLIC_INTERFACE
  this.performCalculation = () => {
    let result = 0;
    const prev = parseFloat(this.prevValue);
    const current = parseFloat(this.currentValue);
    switch (this.operator) {
      case 'add':
        result = prev + current;
        break;
      case 'subtract':
        result = prev - current;
        break;
      case 'multiply':
        result = prev * current;
        break;
      case 'divide':
        if (current === 0) {
          result = 'Error';
        } else {
          result = prev / current;
        }
        break;
      default:
        return;
    }
    this.currentValue = String(result).length > 12 ? Number(result).toExponential(6) : String(result);
    this.operator = null;
    this.prevValue = null;
    this.waitingForNewOperand = false;
  };

  // PUBLIC_INTERFACE
  this.deleteLast = () => {
    if (this.waitingForNewOperand) return;
    if (this.currentValue.length > 1) {
      this.currentValue = this.currentValue.slice(0, -1);
    } else {
      this.currentValue = '0';
    }
  };

  // PUBLIC_INTERFACE
  this.resetCalculator = () => {
    this.currentValue = '0';
    this.prevValue = null;
    this.operator = null;
    this.waitingForNewOperand = false;
  };

  // PUBLIC_INTERFACE
  this.updateDisplay = () => {
    this.display.textContent = this.currentValue;
  };
}

// Initialize app on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  const calculator = new Calculator();
  calculator.init();
});
