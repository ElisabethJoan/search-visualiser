import React from 'react';
import ReactDOM from 'react-dom/client';
import BalancedBinaryTree from './binarytree'

function App() {
  // let arr = Array.from({ length: 30 }, () => Math.floor(Math.random() * 40))

  let nums = new Set();
  while (nums.size !== 15) {
    nums.add(Math.floor(Math.random() * 100) + 1);
  }
  let arr = Array.from(nums)

  let tree = new BalancedBinaryTree(arr);
  let array = tree.toNodeArray();
  console.log(array);
  console.log(tree.root.value)

  return (
    <div className="App">
      <p>test</p>
      {/* <BinarySearchTree /> */}
    </div>
  );
}


ReactDOM.createRoot(document.getElementById('root')).render(<App />);