import React, { Component } from 'react';
import './node.css'

export default class Node extends Component {
    render() {
        const {
            value,
        } = this.props;

        return (
            <div
                className="node">
                {value}
            </div>
        );
    }
}