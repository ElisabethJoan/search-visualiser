import React, { Component } from 'react';

export default class Node extends Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        const {
            value,
            layer,
            colour
        } = this.props;

        return (
            <div
                id=""
                className="">
            </div>
        );
    }
}