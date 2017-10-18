import React from "react";
import PropTypes from "prop-types";
import { DropTarget } from "react-dnd";
import { findDOMNode } from "react-dom";
import ListItem from "./ListItem";

function isHoverOverBox(x, y, rect) {
    const { top, bottom, left, right } = rect;
    return x > left && x < right && y > top && y < bottom;
}

let indexHistory;

const ListPanelTarget = {
    drop(props, monitor, component) {
        component.prevIndex = null;
        component.nextIndex = null;
        component.setOrder();
    },
    hover(props, monitor, component) {
        const { index: oldIndex } = monitor.getItem();
        const { x: offsetX, y: offsetY } = monitor.getClientOffset();

        // component.changeOrder
        // console.log(oldIndex);
        // console.log(component.itemBoundingData);

        component.itemBoundingData.forEach((item, index) => {
            if (isHoverOverBox(offsetX, offsetY, item) /*&& oldIndex !== index*/ && component.nextIndex !== index) {
                // console.log(index);
                // if (component.prevIndex == null) {
                //     component.prevIndex = oldIndex;
                // } else {
                //     component.prevIndex = component.nextIndex;
                // }
                //
                // component.nextIndex = index;
                // console.log("oldIndex:", oldIndex, "   prevIndex:", component.prevIndex, "   nextIndex:", component.nextIndex);

                const prevIndex = component.prevIndex == null ? oldIndex : component.nextIndex;

                const prevHeight = component.itemBoundingData[prevIndex].height;
                const nextHeight = component.itemBoundingData[index].height;

                // console.log("oldIndex:", oldIndex, "   prevIndex:", prevIndex, "   nextIndex:", index);
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
                        component.prevIndex = prevIndex;
                        component.nextIndex = index;
                        console.log("oldIndex:", oldIndex, "   prevIndex:", component.prevIndex, "   nextIndex:", component.nextIndex);
                        // console.log(box);
                        // console.log("change");
                        component.changeOrder(oldIndex);
                    }
                } else {
                    component.prevIndex = prevIndex;
                    component.nextIndex = index;
                    console.log("oldIndex:", oldIndex, "   prevIndex:", component.prevIndex, "   nextIndex:", component.nextIndex);
                    component.changeOrder(oldIndex);
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
    prevIndex = null;
    nextIndex = null;

    constructor(props) {
        super(props);

        this.order = Object.keys(props.data)/*.sort(() => Math.random() - 0.5)*/;
        this.state = {
            itemOrder: this.order
        };
    }

    changeOrder(oldIndex) {
        // if (this.prevIndex !== this.nextIndex) {
        //     console.log(oldIndex, this.nextIndex);
            const order = this.order.slice();
            const item = order.splice(oldIndex, 1)[0];
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