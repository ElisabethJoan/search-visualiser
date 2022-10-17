import React, { Component } from 'react';
import './layer.css'

export default class Layer extends Component {
    render() {
        const {
            className
        } = this.props;

        return (
            <div className={`layer layer${className}`}>
                {this.props.children}
            </div>
        );
    }
}