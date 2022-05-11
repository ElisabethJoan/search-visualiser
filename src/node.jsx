import React, { Component } from 'react';
import './node.css'

export default class Node extends Component {
    render() {
        const {
            value,
            isGoal,
            isPath,
            isActive
        } = this.props;

        const type = isPath
        ? ' path' : isActive
        ? ' active' : isGoal
        ? ' goal' : '';

        return (
            <div
                className={`node${type}`}>
                {value}
            </div>
        );
    }
}