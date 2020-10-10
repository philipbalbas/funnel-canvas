import React, { Component } from "react";
import { DragSource } from "react-dnd";
import { FontIcon } from "@sc/components/ui";

const ItemTypes = { ITEM: "node" };

const cardSource = {
  beginDrag(props) {
    console.log("Drag has begun");
    return {
      type: "arrow",
      settings: props.settings
    };
  }
};

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
});

class ConnectionArrow extends Component {
  render() {
    const {
      connectDragSource,
      connectDragPreview,
      settings,
      hidden
    } = this.props;

    const style = {
      objectArrow: {
        position: "absolute",
        cursor: "pointer",
        right: -20,
        color: "#999",
        padding: 10,
        paddingRight: 20,
        borderRadius: 30
      },
      connectionLineColor: hidden ? "transparent" : "#0FACF8",
      backgroundColor: hidden ? "transparent" : "#F5F5F5"
    };

    return connectDragSource(
      <div
        style={{
          ...style.objectArrow,
          marginTop: settings.height / 2 - 18,
          border: `1px solid ${style.connectionLineColor}`,
          backgroundColor: style.backgroundColor
        }}
      >
        {connectDragPreview(<div style={{ height: 1, width: 1 }} />)}
        <div style={{ zoom: "60%" }}>
          <FontIcon style={{ color: hidden ? "transparent" : "#666" }}>
            play_arrow
          </FontIcon>
        </div>
      </div>
    );
  }
}

export default DragSource(ItemTypes.ITEM, cardSource, collect)(ConnectionArrow);
