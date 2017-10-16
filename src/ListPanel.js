import React from "react";
import PropTypes from "prop-types";
import { DropTarget } from "react-dnd";
import { findDOMNode } from "react-dom";
import ListItem from "./ListItem";

function isHoverOverBox(x, y, rect) {
    const { top, bottom, left, right } = rect;
    return x > left && x < right && y > top && y < bottom;
}

const ListPanelTarget = {
    drop(props, monitor, component) {},
    hover(props, monitor, component) {
        const { index: oldIndex } = monitor.getItem();
        const { x: offsetX, y: offsetY } = monitor.getClientOffset();

        // component.changeOrder
        console.log(oldIndex);
        console.log(component.itemBoundingData);

        component.itemBoundingData.forEach((item, index) => {
            if (isHoverOverBox(offsetX, offsetY, item)) {
                // console.log(index);
                component.changeOrder(oldIndex, index);
            }
        });
    }
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    };
}

@DropTarget("drag-item", ListPanelTarget, collect)
export default class ListPanel extends React.Component {
    itemBoundingData = [];

    constructor(props) {
        super(props);

        this.order = Object.keys(props.data).sort(() => Math.random() - 0.5);
        this.state = {
            itemOrder: this.order
        };
    }

    changeOrder(oldIndex, index) {
        const order = this.order.slice();
        const item = order.splice(oldIndex, 1)[0];
        order.splice(index, 0, item);

        this.setState({
            itemOrder: order
        });
    }

    render() {
        const { connectDropTarget, data } = this.props;
        const { itemOrder } = this.state;

        return connectDropTarget(
            <div className="list-panel">{
                itemOrder.map((key, index) => (
                    <ListItem
                        genItemBoundingData={ ref => {
                            if (ref) {
                                const { top, bottom, left, right, width, height } = ref.getBoundingClientRect();
                                this.itemBoundingData[index] = {
                                    top, bottom, left, right, width, height,
                                    // index: key
                                };
                            }
                        }}
                        key={ key }
                        index={ index }
                        data={ data[key] }
                    />
                ))
            }</div>
        )
    }
}