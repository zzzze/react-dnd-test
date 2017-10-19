import React from "react";
import PropTypes from "prop-types";
import { DropTarget } from "react-dnd";
import { findDOMNode } from "react-dom";
import ListItem from "./ListItem";

function isHoverOverBox(x, y, box) {
    const { top, bottom, left, right } = box;
    return x > left && x < right && y > top && y < bottom;
}

const ListPanelTarget = {
    drop(props, monitor, component) {
        component.nextIndex = null;
        component.setOrder();
    },
    hover(props, monitor, component) {
        const { index: indexWhenDragBegin } = monitor.getItem();
        const { x: offsetX, y: offsetY } = monitor.getClientOffset();

        // component.changeOrder
        // console.log(indexWhenDragBegin);
        // console.log(component.itemBoundingData);

        component.itemBoundingData.forEach((item, index) => {
            if (isHoverOverBox(offsetX, offsetY, item) && component.nextIndex !== index) {
                const prevIndex = component.nextIndex == null ? indexWhenDragBegin : component.nextIndex;

                const prevHeight = component.itemBoundingData[prevIndex].height;
                const nextHeight = component.itemBoundingData[index].height;

                // console.log("indexWhenDragBegin:", indexWhenDragBegin, "   prevIndex:", prevIndex, "   nextIndex:", index);
                // console.log("prevHeight:", prevHeight, "   nextHeight:", nextHeight);

                if (prevHeight < nextHeight) {
                    const box = prevIndex < index ? {
                            ...component.itemBoundingData[index],
                            top: component.itemBoundingData[index].bottom - prevHeight
                        } : {
                            ...component.itemBoundingData[index],
                            bottom: component.itemBoundingData[index].top + nextHeight
                        };
                    if (isHoverOverBox(offsetX, offsetY, box)) {
                        console.log("indexWhenDragBegin:", indexWhenDragBegin, "   prevIndex:", prevIndex, "   nextIndex:", index);
                        // console.log("change");
                        component.nextIndex = index;
                        component.changeOrder(indexWhenDragBegin);
                    }
                } else {
                    component.nextIndex = index;
                    console.log("indexWhenDragBegin:", indexWhenDragBegin, "   prevIndex:", prevIndex, "   nextIndex:", index);
                    component.changeOrder(indexWhenDragBegin);
                }
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
export default class ListPanel extends React.PureComponent {
    itemBoundingData = [];
    nextIndex = null;

    constructor(props) {
        super(props);

        this.order = Object.keys(props.data)/*.sort(() => Math.random() - 0.5)*/;
        this.state = {
            itemOrder: this.order
        };
    }

    changeOrder(indexWhenDragBegin) {
        // if (this.prevIndex !== this.nextIndex) {
        //     console.log(indexWhenDragBegin, this.nextIndex);
            const order = this.order.slice();
            const item = order.splice(indexWhenDragBegin, 1)[0];
            order.splice(this.nextIndex, 0, item);

            this.setState({
                itemOrder: order
            });
        // }
    }

    setOrder() {
        this.order = this.state.itemOrder;
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