import React, { useState } from 'react';
import './Calculator.css';
import axios from 'axios';

function Calculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleClear = () => {
    setInput('');
    setResult(null);
  };

  const handleCalculate = async () => {
    try {
      let apiUrl = 'http://localhost:8080/api/calculate';
      let payload = { type: '', operand1: 0, operand2: 0 };

      if (input.includes('sin') || input.includes('cos') || input.includes('tan') || input.includes('exp') || input.includes('log')) {
        // Traitement des fonctions trigonométriques et autres opérations spéciales
        const [operation, operand] = input.match(/([a-z]+)\((\d+(\.\d+)?)\)/).slice(1, 3);
        payload.operand1 = parseFloat(operand);

        switch (operation) {
          case 'sin':
            payload.type = 'sin';
            break;
          case 'cos':
            payload.type = 'cos';
            break;
          case 'tan':
            payload.type = 'tan';
            break;
          case 'exp':
            payload.type = 'exp';
            break;
          case 'log':
            payload.type = 'log';
            break;
          default:
            throw new Error("Opération inconnue");
        }
      } else {
        // Traitement des opérations classiques (addition, soustraction, etc.)
        const regex = /(\d+)([+\-*/])(\d+)/;
        const match = input.match(regex);

        if (!match) {
          throw new Error("L'expression doit être sous la forme 'operande1 operator operande2'");
        }

        const operand1 = parseFloat(match[1]);
        const operator = match[2];
        const operand2 = parseFloat(match[3]);

        payload.operand1 = operand1;
        payload.operand2 = operand2;

        switch (operator) {
          case '+':
            payload.type = 'addition';
            break;
          case '-':
            payload.type = 'soustraction';
            break;
          case '*':
            payload.type = 'multiplication';
            break;
          case '/':
            payload.type = 'division';
            break;
          default:
            throw new Error("Opérateur inconnu");
        }
      }

      const response = await axios.post(apiUrl, payload);
      setResult(response.data);

    } catch (error) {
      console.error("Error calculating", error);
      setResult('Erreur: ' + error.message);
    }
  };

  const addToInput = (value) => {
    setInput(input + value);
  };

  return (
    <div className="calculator">
      <div className="result">{result !== null ? `Result: ${result}` : ''}</div>
      <input 
        type="text" 
        value={input} 
        onChange={handleInputChange} 
        placeholder="Enter expression (e.g., 5 + 3, sin(30))" 
      />
      <div className="buttons">
        {[1, 2, 3].map(num => <button key={num} onClick={() => addToInput(num.toString())}>{num}</button>)}
        {[4, 5, 6].map(num => <button key={num} onClick={() => addToInput(num.toString())}>{num}</button>)}
        {[7, 8, 9].map(num => <button key={num} onClick={() => addToInput(num.toString())}>{num}</button>)}
        <button onClick={() => addToInput('0')}>0</button>
        <button onClick={() => addToInput('+')}>+</button>
        <button onClick={() => addToInput('-')}>-</button>
        <button onClick={() => addToInput('*')}>*</button>
        <button onClick={() => addToInput('/')}>/</button>
        <button onClick={() => addToInput('sin(')}>sin(</button>
        <button onClick={() => addToInput('cos(')}>cos(</button>
        <button onClick={() => addToInput('tan(')}>tan(</button>
        <button onClick={() => addToInput('exp(')}>exp(</button>
        <button onClick={() => addToInput('log(')}>log(</button>
        <button onClick={() => addToInput(')')}>)</button>
        <button onClick={handleCalculate}>Calculate</button>
        <button onClick={handleClear}>Clear</button>
      </div>
    </div>
  );
}

export default Calculator;
