import React from 'react';
import LineTo from 'react-lineto';

// import BalancedBinaryTree from './binarytree';
import Layer from './layer';
import Node from './node';

import './handler.css'

const ANIMATION_DELAY = 200;

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
        await timer(ANIMATION_DELAY);
        node.isActive = !node.isActive;
        this.forceUpdate()
    }


    setStateSynchronous(stateUpdate) {
        return new Promise(resolve => {
            this.setState(stateUpdate, () => resolve());
        });
    }


    async dfs(node) {
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

        if (await this.dfs(node.left)) {
            await this.setStateSynchronous(({path: [...this.state.path, 'left']}));
            node.isPath = true;
            this.forceUpdate()
            await timer(ANIMATION_DELAY);
            return true;
        }
        
        if (node.left !== null && node.right !== null) {
            await this.flipActive(node);
        }

        if (await this.dfs(node.right)) {
            await this.setStateSynchronous(({path: [...this.state.path, 'right']}));
            node.isPath = true;
            this.forceUpdate()
            await timer(ANIMATION_DELAY);
            return true;
        }

        if (node.left !== null && node.right !== null) {
            await this.flipActive(node);
        }
    }


    async wrapper(node) {
        this.setState({path: []});
        await this.dfs(node);
        this.setState({path: this.state.path.reverse()});
    }


    render() {
        // const { array, path } = this.state;
        const { path } = this.state;

        let from = 0;
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

        return (
            <div className="warpper">
                <div className="handler">
                    {[...Array(4)].map((x, idx) => {
                        let to = (from * 2) + 1
                        return (
                            <Layer key={idx}>
                                {/* {array.slice(from, to).map((node, innerIdx) => { */}
                                {this.props.nodes.slice(from, to).map((node, innerIdx) => { 
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
                {/* <button onClick={() => this.wrapper(array[0])}>depth first search</button> */}
                <button onClick={() => this.wrapper(this.props.nodes[0])}>depth first search</button>
            </div>
        );
    }
}