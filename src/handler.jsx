import React from 'react';

import BalancedBinaryTree from './binarytree'
import Layer from './layer'
import Node from './node'

const timer = ms => new Promise(res => setTimeout(res, ms));

export default class Handler extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            array: [],
            path: []
        }
    }

    async flipActive(node) {
        node.isActive = !node.isActive;
        this.forceUpdate()
        await timer(200);
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
        goalIdx = 8
        array[goalIdx].isGoal = true;
        this.setState({array: array})
    }
    

    async dfs(node) {
        // console.log(this.state.path)
        if (node === null) {
            return false;
        } else {
            // await this.flipActive(node);
        }

        if (node.isGoal === true) {
            // this.setState({path: [...this.state.path, node]})
            return true;
        }

        if (await this.dfs(node.left)) {
            // console.log('left')
            // this.setState({path: [...this.state.path, node]})
            this.setState({path: [...this.state.path, 'left']})
            return true;
        }

        // if (node !== null) {
        //     await this.flipActive(node);
        // }

        if (await this.dfs(node.right)) {
            // console.log('right')
            // this.setState({path: [...this.state.path, node]})
            this.setState({path: [...this.state.path, 'right']})
            return true;
        }

        // if (node !== null) {
        //     await this.flipActive(node);
        // }

    }



    componentDidMount() {
        this.begin()
    }


    render() {
        const { array } = this.state;

        return (
            <div className="Handler">
                <Layer>
                {array.slice(0, 1).map((node, idx) => {
                    return (
                    <Node
                        key={idx}
                        value={node.value}
                        isGoal={node.isGoal}
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
                        isActive={node.isActive}
                        className="node"
                    />
                    );
                })}
                </Layer>
                <button onClick={() => this.dfs(array[0])}>search</button>
                <button onClick={() => console.log(this.state.path)}>print path</button>
            </div>
        );
    }
}