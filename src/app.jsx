import React from "react";
// import LineTo from "react-lineto";
import { Slider, Checkbox } from 'rsuite';

import {
    dfs, bfs, preOrderTraversal, inOrderTraversal, postOrderTraversal,
    levelOrderTraversal, verticalOrderTraversal, reverseLOT, zigZagLOT
} from "./algorithms";
import BalancedBinaryTree from "./binarytree";
import Layer from "./layer";
import Node from "./node";

import "rsuite/dist/rsuite.min.css";
import "./app.css";
import "./handler.css";

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            array: [],
            // lines: [],
            // path: [],
            BST_ACTIVE: false,
            ANIMATION_DELAY: 200,
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

        // let i = 0;
        // let second = false;
        // let lines = [];

        // [...Array(14)].forEach((x, idx) => {
        //     lines.push(
        //         <LineTo
        //             key={idx}
        //             from={`${i}`}
        //             to={`${i * 2 + (1 + second)}`}
        //             borderColor="grey"
        //         />
        //     );
        //     if (!second) {
        //         second = true;
        //     } else {
        //         i++;
        //         second = false;
        //     }
        // });

        // this.setState({ lines: lines });
    }

    async flipActive(node) {
        node.isActive = !node.isActive;
        this.forceUpdate();
        await timer(this.state.ANIMATION_DELAY);
        node.isActive = !node.isActive;
        this.forceUpdate();
    }

    async displayPath(promise) {
        let visited = new Set();
        promise.then(async (arrays) => {
            let nodes = arrays[0];
            for (const node of nodes) {
                await timer(this.state.ANIMATION_DELAY);
                await this.flipActive(node);
                if (!visited.has(node)) {
                    visited.add(node);
                }
            }
            let path = arrays[1];
            if (path) {
                for (const node of path) {
                    await timer(this.state.ANIMATION_DELAY);
                    node.isPath = true;
                    this.forceUpdate();
                }
            }
        })

    }

    // TODO
    // async BinarySearch() {

    // }

    // TODO
    // async makeBST(node) {
    //     let index;

    //     if (node === null) {
    //         return;
    //     }
    //     let n = this.countNodes(node);

    //     let arr = new Array(n);
    //     arr.fill(0);

    //     this.storeInorder(node, arr);

    //     arr.sort(function (a, b) {
    //         return a - b;
    //     });

    //     index = 0;
    //     this.arrayToBST(arr, node);

    //     // this.setState(prevState => ({BST_ACTIVE: !prevState.BST_ACTIVE}))
    // }

    // async storeInorder() {
    //     return 0;
    // }

    // async arrayToBST() {
    //     return 0;
    // }

    // async countNodes(node) {
    //     if (node == null) {
    //         return 0;
    //     }

    //     return this.countNodes(node.left) + this.countNodes(node.right) + 1;
    // }

    render() {
        const { array, BST_ACTIVE, ANIMATION_DELAY } = this.state;
        let from = 0;

        return (
            <div className="warpper">
                <div className="interface">
                    <ul>
                        <li>
                            <h5>Search</h5>
                        </li>
                        <li>
                            <button onClick={() => this.displayPath(dfs(array[0]))}>
                                Depth-first Search
                            </button>
                        </li>
                        <li>
                            <button onClick={() => this.displayPath(bfs(array[0]))}>
                                Breadth-first Search
                            </button>
                        </li>
                        <li>
                            <button 
                                disabled={!BST_ACTIVE} 
                                onClick={() => this.BinarySearch(array[0])}>
                                    Binary Search
                            </button>
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <h5>Traversals</h5>
                        </li>
                        <li>
                            <button onClick={() => this.displayPath(preOrderTraversal(array[0]))}>
                                Pre-order
                            </button>
                        </li>
                        <li>
                            <button onClick={() => this.displayPath(inOrderTraversal(array[0]))}>
                                In-order
                            </button>
                        </li>
                        <li>
                            <button onClick={() => this.displayPath(postOrderTraversal(array[0]))}>
                                Post-order
                            </button>
                        </li>
                        <li>
                            <button onClick={() => this.displayPath(levelOrderTraversal(array[0]))}>
                                Level-order
                            </button>
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <h5>Challenge Traversals</h5>
                        </li>
                        <li>
                            <button onClick={() => this.displayPath(verticalOrderTraversal(array[0]))}>
                                Vertical-order
                            </button>
                        </li>
                        <li>
                            <button onClick={() => this.displayPath(reverseLOT(array[0]))}>
                                Reverse Level-order
                            </button>
                        </li>
                        <li>
                            <button onClick={() => this.displayPath(zigZagLOT(array[0]))}>
                                ZigZag Level-order
                            </button>
                        </li>
                    </ul>
                    <ul>
                        <li><h5>Settings</h5></li>
                        <li><Checkbox onChange={() => this.setState(prevState => ({BST_ACTIVE: !prevState.BST_ACTIVE}))}> Binary Search Tree </Checkbox></li>
                        <li>Animation Delay</li>
                        <li><Slider defaultValue={ANIMATION_DELAY} min={50} step={50}
                            max={300} graduated progress value={ANIMATION_DELAY}
                            onChange={value => {
                                this.setState({ ANIMATION_DELAY: value });
                            }} /></li>
                        <li>Tree Height</li>
                        <li><Slider defaultValue={4} min={3} step={1} max={6} graduated progress /></li>
                    </ul>
                </div>
                <div className="handler">
                    {[...Array(4)].map((_, idx) => {
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
                {/* <div className="realLines">
                    {lines.map((line) => {
                        return line;
                    })}
                </div> */}
                {/* <p>{path.join(" ")}</p> */}
            </div>
        );
    }
}
