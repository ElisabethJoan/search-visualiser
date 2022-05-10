import React, { Component } from 'react';

import Node from './node'
import './layer.css'

export default class Layer extends Component {
    render() {
        const {
            array
        } = this.props;

        return (
            <div className='layer'>
                {array.map((node, idx) => {
                    return (
                    <Node
                        key={idx}
                        value={node.value}
                        className="node"
                    />
                    );
                })}
            </div>
        );
    }
}