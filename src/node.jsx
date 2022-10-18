import React, { Component } from 'react';
import './node.css'

export default class Node extends Component {
    constructor(props) {
        super(props);

        this.handleClick.bind(this);
    }

    handleClick = (idx) => {
        this.props.setStateOfParent(idx);

    }

    render() {
        const {
            value,
            isGoal,
            isPath,
            isActive, 
            className
        } = this.props;

        const type = isPath
        ? 'path' : isActive
        ? 'active' : isGoal
        ? 'goal' : '';

        return (
            <div
                className={`myNode ${className} ${type}`}
                onClick={() => this.handleClick(className)}>
                {value}
            </div>
        );
    }
}