import React from "react";
import PropTypes from "prop-types";
import { DragSource } from "react-dnd";
import { findDOMNode } from "react-dom";

const ItemSource = {
    beginDrag(props) {
        const { index } = props;

        return {
            index
        };
    }
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

@DragSource("drag-item", ItemSource, collect)
export default class ListItem extends React.PureComponent {
    render() {
        const { connectDragSource, data, genItemBoundingData, isDragging } = this.props;

        return connectDragSource(
            <div ref={genItemBoundingData} className="list-item" style={{ height: `${data.size * 20}px`, backgroundColor: `${isDragging ? "gray" : "white"}` }}>
                { data.title }
            </div>
        )
    }
}