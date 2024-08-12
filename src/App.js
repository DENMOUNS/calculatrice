import React from 'react';
import Calculator from './components/Calculator'; // Import correct du composant

function App() {
  return (
    <div className="App">
      <h1>Scientific Calculator</h1>
      <Calculator /> {/* Assurez-vous que le composant est utilisé ici */}
    </div>
  );
}

export default App;
