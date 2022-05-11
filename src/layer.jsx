import React, { Component } from 'react';
import './layer.css'

export default class Layer extends Component {
    render() {

        return (
            <div className='layer'>
                {this.props.children}
            </div>
        );
    }
}