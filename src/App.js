/**
 * Created by zzzz on 15/07/2017.
 */
import React, { Component } from "react";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import ListPanel from "./ListPanel";
import "./style.scss";
import data from "./data.json";

@DragDropContext(HTML5Backend)
export default class App extends Component {
    componentDidMount() {
        // setInterval(() => {
        //     this.setState(prevState => ({
        //         itemOrder: prevState.itemOrder.sort(() => Math.random() - 0.5)
        //     }));
        // }, 1000);
    }

    render() {
        return (
            <div className="page">
                <ListPanel data={data}/>
            </div>
        );
    }
}