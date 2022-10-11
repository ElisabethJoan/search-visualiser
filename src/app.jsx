import React from 'react';
import LineTo from 'react-lineto';

import BalancedBinaryTree from './binarytree';
import Layer from './layer';
import Node from './node';

import './handler.css'

const ANIMATION_DELAY = 200;

const timer = ms => new Promise(res => setTimeout(res, ms));

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            array: [],
            lines : [],
            path: [],
        }
    }


    async begin() {
        let nums = new Set();
        while (nums.size !== 15) {
            nums.add(Math.floor(Math.random() * 99) + 1);
        }
        let arr = Array.from(nums)
        
        let tree = new BalancedBinaryTree(arr);
        let array = tree.toNodeArray();

        let goalIdx = Math.floor(Math.random() * 12) + 3;
        array[goalIdx].isGoal = true;

        array.forEach((node, idx) => {
            node.idx = idx
        })

        this.setState({array: array})
    }

    componentDidMount() {
        this.begin();
        // let array = this.begin();
        // console.log(array)


        let i = 0;
        let second = false;
        let lines = [];

        [...Array(14)].forEach((x, idx) => {
            lines.push(<LineTo key={idx} from={`${i}`} to={`${(i * 2)+ (1 + second)}`} borderColor="grey" />);
            if (!second) {
                second = true;
            } else {
                i++;
                second = false;
            }
        })
      
        // let goalIdx = Math.floor(Math.random() * 15) + 7;
        
        // console.log(array.length)
        // array[goalIdx].isGoal = true;
        
        // array.forEach((node, idx) => {
        //     node.idx = idx;
        // })
        // this.setState({ array: array, lines: lines });
        this.setState({lines: lines})
        
    }

    async flipActive(node) {
        node.isActive = !node.isActive;
        this.forceUpdate()
        await timer(ANIMATION_DELAY);
        node.isActive = !node.isActive;
        this.forceUpdate()
    }


    setStateSynchronous(stateUpdate) {
        return new Promise(resolve => {
            this.setState(stateUpdate, () => resolve());
        });
    }


    async bfs(root) {
        if (root === null) {
            return;
        }

        let queue = [root];
        let explored = [];          

        while (queue.length > 0) {
            let node = queue[0];
            await this.flipActive(node);
            
            if (node.isGoal === true)
            {
                explored.push(node);
                break;
            }

            if (node.left !== null) {
                queue.push(node.left)
            }

            if (node.right !== null) {
                queue.push(node.right)
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
        this.setState({path:[]});
        let count = await this.bfs(node);
        console.log("Path found in " + count + " nodes")
    }


    async dfsWrapper(node) {
        this.setState({path: []});
        let visited = new Set();
        let self = this

        async function dfs(node) {
            visited.add(node);
            if (node === null) {
                return false;
            } else {
                await self.flipActive(node);
            }
    
            if (node.isGoal === true) {
                node.isPath = true;
                self.forceUpdate()
                return true;
            }
    
            if (await dfs(node.left)) {
                await self.setStateSynchronous(({path: [...self.state.path, 'left']}));
                node.isPath = true;
                self.forceUpdate()
                await timer(ANIMATION_DELAY);
                return true;
            }
            
            if (node.left !== null && node.right !== null) {
                await self.flipActive(node);
            }
    
            if (await dfs(node.right)) {
                await self.setStateSynchronous(({path: [...self.state.path, 'right']}));
                node.isPath = true;
                self.forceUpdate()
                await timer(ANIMATION_DELAY);
                return true;
            }
    
            if (node.left !== null && node.right !== null) {
                await self.flipActive(node);
            }
        }

        await dfs(node);
        console.log("Path found in " + visited.size + " nodes")
        this.setState({path: this.state.path.reverse()});
    }

    async levelOrderTraversal(node) {
        let self = this

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

    // https://leetcode.com/problems/binary-tree-level-order-traversal-ii/
    async reverseLOT(node) {
        let self = this
        console.log("test")

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
            console.log(i)
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
            console.log(i)
            console.log(i % 2)
            if (i % 2 === 1) {
                await zigzagL(node, i);
            } else {
                await zigzagR(node, i);
            }
           
        }
    }

    async preOrderTraversal(node) {
        let visited = new Set();
        let self = this

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
        let self = this

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
        let self = this

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


    render() {
        const { array, lines, path } = this.state;
        // const { path } = this.state;

        let from = 0;

        return (
            <div className="warpper">
                <div className="handler">
                    {[...Array(4)].map((x, idx) => {
                        let to = (from * 2) + 1
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
                <div className='realLines'>
                    {lines.map((line) => {
                        return (
                            line
                        );
                    })}
                </div>
                <p>{path.join(' ')}</p>
                <button onClick={() => this.dfsWrapper(array[0])}>depth first search</button>
                <button onClick={() => this.bfsWrapper(array[0])}>bfs</button>
                <button onClick={() => this.levelOrderTraversal(array[0])}>lot</button>
                <button onClick={() => this.preOrderTraversal(array[0])}>preOT</button>
                <button onClick={() => this.inOrderTraversal(array[0])}>inOT</button>
                <button onClick={() => this.postOrderTraversal(array[0])}>postOT</button>
                <button onClick={() => this.zigZagLOT(array[0])}>zigzag</button>
                <button onClick={() => this.reverseLOT(array[0])}>reverseLOT</button>
                <button onClick={() => this.verticalOrderTraversal(array[0])}>vertLOT</button>
                {/* <button onClick={() => this.wrapper(this.props.nodes[0])}>depth first search</button> */}
            </div>
        );
    }
}