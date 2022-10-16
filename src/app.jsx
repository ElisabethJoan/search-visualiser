import React from "react";
// import LineTo from "react-lineto";
import { Slider, Checkbox } from 'rsuite';

import {
    dfs, bfs, binarySearch, preOrderTraversal, inOrderTraversal, postOrderTraversal,
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
            nums: [],
            tree: [],
            visited: [],
            goalIdx: 0,
            // lines: [],
            // path: [],
            BST_ACTIVE: false,
            ANIMATION_DELAY: 200,
        };
    }

    async begin(sorted, nums) {
        let goalIdx = this.state.goalIdx;

        if (sorted) {
            nums.sort(function (a, b) {
                return a - b;
            });

            this.setState({ BST_ACTIVE: true })
        } else {
            nums = new Set();
            while (nums.size !== 15) {
                nums.add(Math.floor(Math.random() * 99) + 1);
            }
            nums = Array.from(nums);
            goalIdx = Math.floor(Math.random() * 12) + 3;
        }

        let tree = new BalancedBinaryTree(nums);
        let array = tree.toNodeArray();

        array[goalIdx].isGoal = true;

        array.forEach((node, idx) => {
            node.idx = idx;
        });

        this.setState({ nums: nums, tree: array, goalIdx: goalIdx });
    }

    componentDidMount() {
        this.begin(false, []);

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
            this.setState({ visited: Array.from(visited) })
        })
    }

    render() {
        const { nums, tree, visited, goalIdx, BST_ACTIVE, ANIMATION_DELAY } = this.state;
        let from = 0;

        return (
            <div className="warpper">
                <div className="interface">
                    <ul>
                        <li>
                            <h5>Search</h5>
                        </li>
                        <li>
                            <button onClick={() => this.displayPath(dfs(tree[0]))}>
                                Depth-first Search
                            </button>
                        </li>
                        <li>
                            <button onClick={() => this.displayPath(bfs(tree[0]))}>
                                Breadth-first Search
                            </button>
                        </li>
                        <li>
                            <button 
                                disabled={!BST_ACTIVE} 
                                onClick={() => this.displayPath(binarySearch(tree, tree[goalIdx]))}>
                                    Binary Search
                            </button>
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <h5>Traversals</h5>
                        </li>
                        <li>
                            <button onClick={() => this.displayPath(preOrderTraversal(tree[0]))}>
                                Pre-order
                            </button>
                        </li>
                        <li>
                            <button onClick={() => this.displayPath(inOrderTraversal(tree[0]))}>
                                In-order
                            </button>
                        </li>
                        <li>
                            <button onClick={() => this.displayPath(postOrderTraversal(tree[0]))}>
                                Post-order
                            </button>
                        </li>
                        <li>
                            <button onClick={() => this.displayPath(levelOrderTraversal(tree[0]))}>
                                Level-order
                            </button>
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <h5>Challenge Traversals</h5>
                        </li>
                        <li>
                            <button onClick={() => this.displayPath(verticalOrderTraversal(tree[0]))}>
                                Vertical-order
                            </button>
                        </li>
                        <li>
                            <button onClick={() => this.displayPath(reverseLOT(tree[0]))}>
                                Reverse Level-order
                            </button>
                        </li>
                        <li>
                            <button onClick={() => this.displayPath(zigZagLOT(tree[0]))}>
                                ZigZag Level-order
                            </button>
                        </li>
                    </ul>
                    <ul>
                        <li><h5>Settings</h5></li>
                        <li><Checkbox onChange={() => this.begin(true, nums)}> Binary Search Tree </Checkbox></li>
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
                                {tree.slice(from, to).map((node, innerIdx) => {
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
                <br/><br/>
                <div className="traversalPath">
                    <h4>Traversal Path</h4>
                    <Layer>
                        {visited.map((node, idx) => {
                            return (
                                <Node
                                    key={idx}
                                    value={node.value}
                                    isActive={true}
                                />
                            );
                        })}
                    </Layer>
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
