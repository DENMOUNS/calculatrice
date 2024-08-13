import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { evaluate } from 'mathjs';
import './Calculator.css';

const BUTTONS = [
  '1', '2', '3',
  '4', '5', '6',
  '7', '8', '9',
  '0', '+', '-', '*', '/', 'sin(', 'cos(', 'tan(', 'exp(', 'log(', ')'
];

function Calculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);

  const handleInputChange = useCallback((e) => {
    setInput(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setInput('');
    setResult(null);
  }, []);

  const handleCalculate = useCallback(async () => {
    try {
      let apiUrl = 'http://localhost:8080/api/calculate';
      let payload = { type: '', operands: [] };

      const functionMatch = input.match(/(sin|cos|tan|exp|log)\((\d+(\.\d+)?)\)/);
      if (functionMatch) {
        const [operation, operand] = functionMatch.slice(1, 3);
        payload.operands = [parseFloat(operand)];
        payload.type = operation;
      } else {
        // Use mathjs to evaluate the expression safely
        const result = evaluate(input);
        setResult(result);
        return;
      }

      const response = await axios.post(apiUrl, payload);
      setResult(response.data);

    } catch (error) {
      console.error("Erreur de calcul", error);
      setResult('Erreur: ' + error.message);
    }
  }, [input]);

  const addToInput = useCallback((value) => {
    setInput(prevInput => prevInput + value);
  }, []);

  return (
    <div className="calculator">
      <div className="result">{result !== null ? `Résultat: ${result}` : ''}</div>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Entrez une expression (ex : 1 + 2 + 3, sin(30))"
      />
      <div className="buttons">
        {BUTTONS.map(button => (
          <button key={button} onClick={() => addToInput(button)}>
            {button}
          </button>
        ))}
        <button onClick={handleCalculate}>Calculer</button>
        <button onClick={handleClear}>Effacer</button>
      </div>
    </div>
  );
}

export default Calculator;
