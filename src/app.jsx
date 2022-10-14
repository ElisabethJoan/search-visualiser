import React from "react";
import LineTo from "react-lineto";
import { Slider } from 'rsuite';

import BalancedBinaryTree from "./binarytree";
import Layer from "./layer";
import Node from "./node";

import "rsuite/dist/rsuite.min.css";
import "./app.css";
import "./handler.css";

const ANIMATION_DELAY = 200;

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      array: [],
      lines: [],
      path: [],
    };
  }



  async begin() {
    let nums = new Set();
    while (nums.size !== 15) {
      nums.add(Math.floor(Math.random() * 99) + 1);
    }
    let arr = Array.from(nums);

    let tree = new BalancedBinaryTree(arr);
    let array = tree.toNodeArray();

    let goalIdx = Math.floor(Math.random() * 12) + 3;
    array[goalIdx].isGoal = true;

    array.forEach((node, idx) => {
      node.idx = idx;
    });

    this.setState({ array: array });
  }

  componentDidMount() {
    this.begin();
    // let array = this.begin();
    // console.log(array)

    let i = 0;
    let second = false;
    let lines = [];

    [...Array(14)].forEach((x, idx) => {
      lines.push(
        <LineTo
          key={idx}
          from={`${i}`}
          to={`${i * 2 + (1 + second)}`}
          borderColor="grey"
        />
      );
      if (!second) {
        second = true;
      } else {
        i++;
        second = false;
      }
    });

    // let goalIdx = Math.floor(Math.random() * 15) + 7;

    // console.log(array.length)
    // array[goalIdx].isGoal = true;

    // array.forEach((node, idx) => {
    //     node.idx = idx;
    // })
    // this.setState({ array: array, lines: lines });
    this.setState({ lines: lines });
  }

  async flipActive(node) {
    node.isActive = !node.isActive;
    this.forceUpdate();
    await timer(ANIMATION_DELAY);
    node.isActive = !node.isActive;
    this.forceUpdate();
  }

  setStateSynchronous(stateUpdate) {
    return new Promise((resolve) => {
      this.setState(stateUpdate, () => resolve());
    });
  }

  // // TODO
  // async BinarySearch() {

  // }

  async bfs(root) {
    if (root === null) {
      return;
    }

    let queue = [root];
    let explored = [];

    while (queue.length > 0) {
      let node = queue[0];
      await this.flipActive(node);

      if (node.isGoal === true) {
        explored.push(node);
        break;
      }

      if (node.left !== null) {
        queue.push(node.left);
      }

      if (node.right !== null) {
        queue.push(node.right);
      }

      // node.isPath = true;
      explored.push(queue.shift());
      // this.forceUpdate();
    }
    // explored.forEach(e => {
    //     console.log(e)
    // })
    return explored.length;
  }

  async bfsWrapper(node) {
    this.setState({ path: [] });
    let count = await this.bfs(node);
    console.log("Path found in " + count + " nodes");
  }

  async dfsWrapper(node) {
    this.setState({ path: [] });
    let visited = new Set();
    let self = this;

    async function dfs(node) {
      visited.add(node);
      if (node === null) {
        return false;
      } else {
        await self.flipActive(node);
      }

      if (node.isGoal === true) {
        node.isPath = true;
        self.forceUpdate();
        return true;
      }

      if (await dfs(node.left)) {
        await self.setStateSynchronous({ path: [...self.state.path, "left"] });
        node.isPath = true;
        self.forceUpdate();
        await timer(ANIMATION_DELAY);
        return true;
      }

      if (node.left !== null && node.right !== null) {
        await self.flipActive(node);
      }

      if (await dfs(node.right)) {
        await self.setStateSynchronous({ path: [...self.state.path, "right"] });
        node.isPath = true;
        self.forceUpdate();
        await timer(ANIMATION_DELAY);
        return true;
      }

      if (node.left !== null && node.right !== null) {
        await self.flipActive(node);
      }
    }

    await dfs(node);
    console.log("Path found in " + visited.size + " nodes");
    this.setState({ path: this.state.path.reverse() });
  }

  async levelOrderTraversal(node) {
    let self = this;

    async function lot(node, depth) {
      if (node === null) {
        return;
      }
      if (depth === 1) {
        await self.flipActive(node);
      } else if (depth > 1) {
        await lot(node.left, depth - 1);
        await lot(node.right, depth - 1);
      }
    }

    for (let i = 1; i <= 4; i++) {
      await lot(node, i);
    }
  }

  // TODO
  // https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/
  async verticalOrderTraversal(node) {
    let self = this;

    const findInsertPositionForLevel = (elements, level, insertValue) => {
      let insertAt = null;
      let index = elements.length - 1;

      while (
        index >= 0 &&
        elements[index][1] === level &&
        elements[index][0] > insertValue
      ) {
        insertAt = index;
        index--;
      }

      return insertAt;
    };

    async function verticalSort(node) {
        const lookup = new Map();
        const queue = [[node, 0, 0]];
        let leftMin = Infinity;
        let rightMax = -Infinity;

        while (queue.length) {
        const [node, distance, level] = queue.shift();

        !lookup.has(distance) && lookup.set(distance, []);
        const elements = lookup.get(distance);
        const insertAt = findInsertPositionForLevel(elements, level, node.value);
        const insertAtEnd = typeof insertAt !== "number";
        const nodeToInsert = [node, level];
        insertAtEnd
            ? elements.push(nodeToInsert)
            : elements.splice(insertAt, 0, nodeToInsert);

        if (node.left) {
            queue.push([node.left, distance - 1, level + 1]);
        }

        if (node.right) {
            queue.push([node.right, distance + 1, level + 1]);
        }

        leftMin = Math.min(leftMin, distance);
        rightMax = Math.max(rightMax, distance);
        }

        for (let distance = leftMin; distance <= rightMax; distance++) {
            let temp = lookup.get(distance)
            for await (const element of temp) {
                await timer(ANIMATION_DELAY);
                await self.flipActive(element[0])
            }
        }
    }

    await verticalSort(node);
  }

  // https://leetcode.com/problems/binary-tree-level-order-traversal-ii/
  async reverseLOT(node) {
    let self = this;
    console.log("test");

    async function lot(node, depth) {
      if (node === null) {
        return;
      }
      if (depth === 1) {
        await self.flipActive(node);
      } else if (depth > 1) {
        await lot(node.left, depth - 1);
        await lot(node.right, depth - 1);
      }
    }

    for (let i = 4; i > 0; i--) {
      console.log(i);
      await lot(node, i);
    }
  }

  // https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/
  async zigZagLOT(node) {
    let self = this;

    async function zigzagL(node, depth) {
      if (node === null) {
        return;
      }
      if (depth === 1) {
        await self.flipActive(node);
      } else if (depth > 1) {
        await zigzagL(node.left, depth - 1);
        await zigzagL(node.right, depth - 1);
      }
    }

    async function zigzagR(node, depth) {
      if (node === null) {
        return;
      }
      if (depth === 1) {
        await self.flipActive(node);
      } else if (depth > 1) {
        await zigzagR(node.right, depth - 1);
        await zigzagR(node.left, depth - 1);
      }
    }

    for (let i = 1; i <= 4; i++) {
      console.log(i);
      console.log(i % 2);
      if (i % 2 === 1) {
        await zigzagL(node, i);
      } else {
        await zigzagR(node, i);
      }
    }
  }

  async preOrderTraversal(node) {
    let visited = new Set();
    let self = this;

    async function dfs(node) {
      visited.add(node);
      if (node === null) {
        return false;
      } else {
        await self.flipActive(node);
      }

      if (await dfs(node.left)) {
        await timer(ANIMATION_DELAY);
        return true;
      }

      // if (node.left !== null && node.right !== null) {
      //     await self.flipActive(node);
      // }

      if (await dfs(node.right)) {
        await timer(ANIMATION_DELAY);
        return true;
      }

      // if (node.left !== null && node.right !== null) {
      //     await self.flipActive(node);
      // }
    }

    await dfs(node);
  }

  async postOrderTraversal(node) {
    let visited = new Set();
    let self = this;

    async function dfs(node) {
      visited.add(node);
      if (node === null) {
        return false;
      }

      if (await dfs(node.left)) {
        await timer(ANIMATION_DELAY);
        return true;
      }

      // if (node.left !== null && node.right !== null) {
      //     await self.flipActive(node);
      // }

      if (await dfs(node.right)) {
        await timer(ANIMATION_DELAY);
        return true;
      }

      // if (node.left !== null && node.right !== null) {
      //     await self.flipActive(node);
      // }

      await self.flipActive(node);
    }

    await dfs(node);
  }

  async inOrderTraversal(node) {
    let visited = new Set();
    let self = this;

    async function dfs(node) {
      visited.add(node);
      if (node === null) {
        return false;
      }

      if (await dfs(node.left)) {
        await timer(ANIMATION_DELAY);
        return true;
      }

      // if (node.left !== null && node.right !== null) {
      //     await self.flipActive(node);
      // }

      await self.flipActive(node);

      if (await dfs(node.right)) {
        await timer(ANIMATION_DELAY);
        return true;
      }

      // if (node.left !== null && node.right !== null) {
      //     await self.flipActive(node);
      // }
    }

    await dfs(node);
  }

  async storeInorder() {
    return 0;
  }

  async arrayToBST() {
    return 0;
  }

  async countNodes(node) {
    if (node == null) {
      return 0;
    }

    return this.countNodes(node.left) + this.countNodes(node.right) + 1;
  }

  // TODO
  async makeBST(node) {
    let index;

    if (node === null) {
      return;
    }
    let n = this.countNodes(node);

    let arr = new Array(n);
    arr.fill(0);

    this.storeInorder(node, arr);

    arr.sort(function (a, b) {
      return a - b;
    });

    index = 0;
    this.arrayToBST(arr, node);
  }

  render() {
    const { array, lines, path } = this.state;
    // const { path } = this.state;

    let from = 0;

    return (
      <div className="warpper">
        <div className="interface">
          <ul>
            <li>
              <h5>Search</h5>
            </li>
            <li>
              <button onClick={() => this.dfsWrapper(array[0])}>
                Depth-first Search
              </button>
            </li>
            <li>
              <button onClick={() => this.bfsWrapper(array[0])}>
                Breadth-first Search
              </button>
            </li>
          </ul>
          <ul>
            <li>
              <h5>Traversals</h5>
            </li>
            <li>
              <button onClick={() => this.preOrderTraversal(array[0])}>
                Pre-order
              </button>
            </li>
            <li>
              <button onClick={() => this.inOrderTraversal(array[0])}>
                In-order
              </button>
            </li>
            <li>
              <button onClick={() => this.postOrderTraversal(array[0])}>
                Post-order
              </button>
            </li>
            <li>
              <button onClick={() => this.levelOrderTraversal(array[0])}>
                Level-order
              </button>
            </li>
          </ul>
          <ul>
            <li>
              <h5>Challenge Traversals</h5>
            </li>
            <li>
              <button onClick={() => this.reverseLOT(array[0])}>
                Reverse Level-order
              </button>
            </li>
            <li>
              <button onClick={() => this.zigZagLOT(array[0])}>
                ZigZag Level-order
              </button>
            </li>
            <li>
              <button onClick={() => this.verticalOrderTraversal(array[0])}>
                Vertical-order
              </button>
            </li>
          </ul>
          <ul>
            <li>
              <h5>Binary Search Tree</h5>
            </li>
            <li>
              <button onClick={() => this.makeBST(array[0])}>Make BST</button>
            </li>
            <li>
              <button onClick={() => this.reverseLOT(array[0])}></button>
            </li>
          </ul>
          
          <ul>
            <li><h5>Settings</h5></li>
            <li>Animation Speed</li>
            <li><Slider defaultValue={50} min={10} step={10} max={100} graduated progress /></li>
            <li>Tree Height</li>
            <li><Slider defaultValue={4} min={3} step={1} max={6} graduated progress /></li>
          </ul>
        </div>
        <div className="handler">
          {[...Array(4)].map((x, idx) => {
            let to = from * 2 + 1;
            return (
              <Layer key={idx}>
                {array.slice(from, to).map((node, innerIdx) => {
                  // {this.props.nodes.slice(from, to).map((node, innerIdx) => {
                  if (innerIdx === from) {
                    from = to;
                  }
                  return (
                    <Node
                      key={node.idx}
                      value={node.value}
                      isGoal={node.isGoal}
                      isPath={node.isPath}
                      isActive={node.isActive}
                      className={node.idx}
                    />
                  );
                })}
              </Layer>
            );
          })}
        </div>
        <div className="realLines">
          {lines.map((line) => {
            return line;
          })}
        </div>
        <p>{path.join(" ")}</p>
      </div>
    );
  }
}
