import React from 'react';
import ReactDOM from 'react-dom/client';

import BalancedBinaryTree from './binarytree';
import Handler from './handler';


function begin() {
  let nums = new Set();
  while (nums.size !== 15) {
      nums.add(Math.floor(Math.random() * 99) + 1);
  }
  let arr = Array.from(nums)

  let tree = new BalancedBinaryTree(arr);
  let array = tree.toNodeArray();

  return array
}


function App() {

  let array = begin();

  let goalIdx = Math.floor(Math.random() * 15) + 7;
  // goalIdx = 2 + 7
  array[goalIdx].isGoal = true;

  array.forEach((node, idx) => {
      node.idx = idx;
  })


  return (
    <div className="App">
        <Handler nodes={array} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);