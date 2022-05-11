import React from 'react';
import ReactDOM from 'react-dom/client';
import Handler from './handler';

function App() {
  return (
    <div className="App">
        <Handler />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);