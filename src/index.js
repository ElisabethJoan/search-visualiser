import React from 'react';
import ReactDOM from 'react-dom/client';
import BalancedBinaryTree from './binarytree'
import Layer from './layer'

function App() {

  let nums = new Set();
  while (nums.size !== 15) {
    nums.add(Math.floor(Math.random() * 99) + 1);
  }
  let arr = Array.from(nums)

  let tree = new BalancedBinaryTree(arr);
  let array = tree.toNodeArray();

  return (
    <div className="App">
      <Layer array={array.slice(0, 1)} />
      <Layer array={array.slice(1, 3)} />
      <Layer array={array.slice(3, 7)} />
      <Layer array={array.slice(7, 15)} />
    </div>
  );
}


ReactDOM.createRoot(document.getElementById('root')).render(<App />);