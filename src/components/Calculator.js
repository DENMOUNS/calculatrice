import React, { useState } from 'react';
import axios from 'axios';
import { evaluate } from 'mathjs'; // Import de la fonction evaluate
import './Calculator.css'; // Assure-toi que ce fichier existe et est bien stylisé

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

      // Vérifie si l'entrée est une fonction mathématique
      const functionMatch = input.match(/(sin|cos|tan|exp|log)\((\d+(\.\d+)?)\)/);
      if (functionMatch) {
        const [operation, operand] = functionMatch.slice(1, 3);
        payload.operand1 = parseFloat(operand);
        payload.type = operation;
      } else {
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
  };

  const addToInput = (value) => {
    setInput(input + value);
  };

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
        <button onClick={handleCalculate}>Calculer</button>
        <button onClick={handleClear}>Effacer</button>
      </div>
    </div>
  );
}

export default Calculator;
