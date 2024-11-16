import React from "react";
import LineTo from "react-lineto";
import { Button, Checkbox, FormGroup, FormControlLabel, Slider } from '@mui/material';
import { Mutex, Semaphore } from 'async-mutex';

import { HomeRow } from "@elisabethjoan/portfolio-scaffold";

import {
    dfs, bfs, binarySearch, preOrderTraversal, inOrderTraversal, postOrderTraversal,
    levelOrderTraversal, verticalOrderTraversal, reverseLOT, zigZagLOT
} from "./algorithms";
import BalancedBinaryTree from "./binarytree";
import Layer from "./layer";
import Node from "./node";

import "./app.css";

let lock = new Mutex();
let sempahore = new Semaphore(1);
const timer = (ms) => new Promise((res) => setTimeout(res, ms));

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.setStateOfParent.bind(this);
        this.state = {
            path: [],
            nums: [],
            tree: [],
            visited: [],
    goalIdx: 0,
            lines: [],
            BST_ACTIVE: false,
            ANIMATION_DELAY: 200,
            TREE_HEIGHT: 4,
            width: 0, height: 0
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
            const numCount = Math.pow(2, (this.state.TREE_HEIGHT + 1) - 1)
            nums = new Set();
            while (nums.size !== numCount) {
                nums.add(Math.floor(Math.random() * 99) + 1);
            }
            nums = Array.from(nums);
            goalIdx = Math.floor(Math.random() * (numCount - 3)) + 3;
            this.setState({ BST_ACTIVE: false })
        }

        let tree = new BalancedBinaryTree(nums);
        let array = tree.toNodeArray(this.state.TREE_HEIGHT);

        array[goalIdx].isGoal = true;

        array.forEach((node, idx) => {
            node.idx = idx;
        });

        this.setState({ nums: nums, tree: array, goalIdx: goalIdx });
    }

    updateDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    };

    componentDidMount() {
        this.begin(false, []);
        window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    componentDidUpdate(_, prevState) {
        if (this.state.tree[0] !== prevState.tree[0]) {
            let i = 0;
            let second = false;
            let lines = [];
    
            [...Array(Math.pow(2, this.state.TREE_HEIGHT) - 2)].forEach(() => {
                lines.push({from: `${i}`, to: `${i * 2 + (1 + second)}`});
                if (!second) {
                    second = true;
                } else {
                    i++;
                    second = false;
                }
            });
    
            this.setState({ lines: lines });
        }

        if (this.state.TREE_HEIGHT !== prevState.TREE_HEIGHT) {
            let nums = new Set();

            let nodeCount = Math.pow(2, this.state.TREE_HEIGHT) - 1
            while (nums.size !== nodeCount) {
                nums.add(Math.floor(Math.random() * 99) + 1);
            }
            nums = Array.from(nums);

            let upper = Math.pow(2, this.state.TREE_HEIGHT - 2) - 1;
            let lower = nodeCount - upper;
            let goalIdx = Math.floor(Math.random() * lower) + upper;

            let tree = new BalancedBinaryTree(nums);
            let array = tree.toNodeArray(this.state.TREE_HEIGHT);

            array[goalIdx].isGoal = true;

            array.forEach((node, idx) => {
                node.idx = idx;
            });

            this.setState({ nums: nums, tree: array, goalIdx: goalIdx });
        }
    }



    async flipActive(node) {
        node.isActive = !node.isActive;
        this.forceUpdate();
        await timer(this.state.ANIMATION_DELAY);
        node.isActive = !node.isActive;
        this.forceUpdate();
    }
    
    async clearPath() {
      const { path } = this.state;
      path.forEach(element => {
        element.isPath = false;
      });
      this.setState({ path: [] })
    }
    
    async displayPath(promise) {
        this.forceUpdate();
        let release = await lock.acquire();
        let visited = new Set();
        await this.clearPath();

        let [ , releaseSemaphore] = await sempahore.acquire();
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
            this.setState({ path: path, visited: Array.from(visited) })
        })
        releaseSemaphore()
        release();
    }

    setStateOfParent = (goalIdx) => {
        let array = this.state.tree;

        array.forEach((node) => {
            node.isGoal = false;
        });

        array[goalIdx].isGoal = true;

        this.setState({ tree: array, goalIdx: goalIdx });
    }


    render() {
        const { nums, tree, visited, goalIdx, lines, BST_ACTIVE, ANIMATION_DELAY, 
                TREE_HEIGHT } = this.state;
        let from = 0;

        return (
            <div className="wrapper">
                <HomeRow extension=".jsx" />
                <div className="sketch">
                    <div className="graph">
                        {[...Array(6)].map((_, idx) => {
                            let to = from * 2 + 1;
                            return (
                                <Layer key={idx} className={idx}>
                                    {tree.slice(from, to).map((node, innerIdx) => {
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
                                                setStateOfParent={this.setStateOfParent}
                                            />
                                        );
                                    })}
                                </Layer>
                            );
                        })}
                        {lines.map((line, idx) => {
                            return (
                                <LineTo 
                                    key={idx}
                                    from={line.from}
                                    to={line.to}
                                    borderColor="grey"
                                    zIndex={0}
                                />
                            );
                        })}
                    </div>
                    <div className="pathdisplay">
                        <h4>Traversal Path</h4>
                        <Layer className="traversal">
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
                </div>
                <div className="interface">
                    <ul>
                        <li>
                            <h5>Search</h5>
                        </li>
                        <li>
                            <Button 
                                variant="outlined"    
                                onClick={() => this.displayPath(dfs(tree[0]))}
                            >
                                Depth-first Search
                            </Button>
                        </li>
                        <li>
                            <Button 
                                variant="outlined"    
                                onClick={() => this.displayPath(bfs(tree[0]))}
                            >
                                Breadth-first Search
                            </Button>
                        </li>
                        <li>
                            <Button 
                                variant="outlined"    
                                disabled={!BST_ACTIVE} 
                                onClick={() => this.displayPath(binarySearch(tree, tree[goalIdx]))}
                            >
                                    Binary Search
                            </Button>
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <h5>Traversals</h5>
                        </li>
                        <li>
                            <Button 
                                variant="outlined"    
                                onClick={() => this.displayPath(preOrderTraversal(tree[0]))}
                            >
                                Pre-order
                            </Button>
                        </li>
                        <li>
                            <Button 
                                variant="outlined"    
                                onClick={() => this.displayPath(inOrderTraversal(tree[0]))}
                            >
                                In-order
                            </Button>
                        </li>
                        <li>
                            <Button 
                                variant="outlined"    
                                onClick={() => this.displayPath(postOrderTraversal(tree[0]))}>
                                Post-order
                            </Button>
                        </li>
                        <li>
                            <Button 
                                variant="outlined"    
                                onClick={() => this.displayPath(levelOrderTraversal(tree[0], TREE_HEIGHT))}>
                                Level-order
                            </Button>
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <h5>Challenge Traversals</h5>
                        </li>
                        <li>
                            <Button 
                                variant="outlined"    
                                onClick={() => this.displayPath(verticalOrderTraversal(tree[0]))}>
                                Vertical-order
                            </Button>
                        </li>
                        <li>
                            <Button 
                                variant="outlined"
                                onClick={() => this.displayPath(reverseLOT(tree[0], TREE_HEIGHT))}>
                                Reverse Level-order
                            </Button>
                        </li>
                        <li>
                            <Button 
                                variant="outlined"
                                onClick={() => this.displayPath(zigZagLOT(tree[0], TREE_HEIGHT))}>
                                ZigZag Level-order
                            </Button>
                        </li>
                    </ul>
                    <ul className="settings">
                        <li><h5>Settings</h5></li>
                        <li>Animation Delay</li>
                        <li>
                          <Slider 
                            min={50}
                            step={50}
                            max={300} 
                            value={ANIMATION_DELAY}
                            onChange={(_, value) => {
                              this.setState({ ANIMATION_DELAY: value });
                            }} />
                        </li>
                        <li>Tree Height</li>
                        <li>
                          <Slider 
                            min={3}
                            step={1}
                            max={6}
                            value={TREE_HEIGHT} 
                            onChange={(_, value) => {
                              this.setState({ TREE_HEIGHT: value })
                            }} />
                        </li>
                        <li>
                          <FormGroup>
                            <FormControlLabel
                              control={<Checkbox
                                style={{ color: "#1976d2" }}
                                onChange={() => {
                                  if (BST_ACTIVE) {
                                    this.begin(false, nums)
                                    this.setState({ BST_ACTIVE: false })
                                  } else {
                                    this.begin(true, nums)
                                  }}} />
                              }
                              label="Binary Search Tree" />
                          </FormGroup>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}
