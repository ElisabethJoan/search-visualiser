import React from 'react';

import BalancedBinaryTree from './binarytree'
import Layer from './layer'
import Node from './node'

const ANIMATION_DELAY = 300;

const timer = ms => new Promise(res => setTimeout(res, ms));

export default class Handler extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            array: [],
            path: []
        }
    }


    componentDidMount() {
        this.begin()
    }


    async flipActive(node) {
        node.isActive = !node.isActive;
        this.forceUpdate()
        await timer(ANIMATION_DELAY);
        node.isActive = !node.isActive;
        this.forceUpdate()
    }


    begin() {
        let nums = new Set();
        while (nums.size !== 15) {
            nums.add(Math.floor(Math.random() * 99) + 1);
        }
        let arr = Array.from(nums)

        let tree = new BalancedBinaryTree(arr);
        let array = tree.toNodeArray();

        console.log(array)

        let goalIdx = Math.floor(Math.random() * 15) + 7;
        goalIdx = 2 + 7
        array[goalIdx].isGoal = true;
        this.setState({array: array})
    }


    setStateSynchronous(stateUpdate) {
        return new Promise(resolve => {
            this.setState(stateUpdate, () => resolve());
        });
    }


    async dfs(node) {
        console.log(node);
        if (node === null) {
            return false;
        } else {
            await this.flipActive(node);
        }

        if (node.isGoal === true) {
            node.isPath = true;
            this.forceUpdate()
            return true;
        }

        if (node.left !== null && await this.dfs(node.left)) {
            await this.setStateSynchronous(({path: [...this.state.path, 'left']}));
            node.isPath = true;
            this.forceUpdate()
            await timer(ANIMATION_DELAY);
            return true;
        }

        if (node !== null) {
            await this.flipActive(node);
        }

        if (node.left !== null && await this.dfs(node.right)) {
            await this.setStateSynchronous(({path: [...this.state.path, 'right']}));
            node.isPath = true;
            this.forceUpdate()
            await timer(ANIMATION_DELAY);
            return true;
        }

        if (node !== null) {
            await this.flipActive(node);
        }
    }


    async wrapper(node) {
        await this.dfs(node);
        this.setState({path: this.state.path.reverse()});
        console.log(this.state.path);
    }

    
    render() {
        const { array, path } = this.state;

        return (
            <div className="Handler">
                <Layer>
                {array.slice(0, 1).map((node, idx) => {
                    return (
                    <Node
                        key={idx}
                        value={node.value}
                        isGoal={node.isGoal}
                        isPath={node.isPath}
                        isActive={node.isActive}
                        className="node"
                    />
                    );
                })}
                </Layer>
                <Layer>
                {array.slice(1, 3).map((node, idx) => {
                    return (
                    <Node
                        key={idx}
                        value={node.value}
                        isGoal={node.isGoal}
                        isPath={node.isPath}
                        isActive={node.isActive}
                        className="node"
                    />
                    );
                })}
                </Layer>
                <Layer>
                {array.slice(3, 7).map((node, idx) => {
                    return (
                    <Node
                        key={idx}
                        value={node.value}
                        isGoal={node.isGoal}
                        isPath={node.isPath}
                        isActive={node.isActive}
                        className="node"
                    />
                    );
                })}
                </Layer>
                <Layer>
                {array.slice(7, 15).map((node, idx) => {
                    return (
                    <Node
                        key={idx}
                        value={node.value}
                        isGoal={node.isGoal}
                        isPath={node.isPath}
                        isActive={node.isActive}
                        className="node"
                    />
                    );
                })}
                </Layer>
                <p>{path.join(' ')}</p>
                <button onClick={() => this.wrapper(array[0])}>depth first search</button>
            </div>
        );
    }
}