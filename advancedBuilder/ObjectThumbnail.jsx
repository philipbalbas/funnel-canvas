import React from "react";
import { DragSource } from "react-dnd";
import { CardCaption, Cell, FontIcon } from "@sc/components/ui";
import style from "../shared/style";
const Types = { ITEM: "node" };

const itemSource = {
  beginDrag(props) {
    return props;
  },
  endDrag(props) {
    return props;
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

const ObjectThumbnail = props => {
  const { screenshot, icon, iconUrl, color } = props.item;

  const Thumbnail = props => {
    if (screenshot)
      return (
        <img
          alt=""
          src={screenshot}
          style={{ maxWidth: "100%", maxHeight: "100%", height: 105 }}
        />
      );

    if (icon)
      return (
        <div style={{ ...style.objThumbnail, backgroundColor: color }}>
          <FontIcon style={{ color: "#f5f5f5", fontSize: "46pt" }}>
            {icon}
          </FontIcon>
        </div>
      );

    if (iconUrl)
      return (
        <div style={{ ...style.objThumbnail, backgroundColor: color }}>
          <img
            alt=""
            src={iconUrl}
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        </div>
      );
  };
  return props.connectDragSource(
    <div>
      <Cell style={style.basicStyle}>
        <Thumbnail />
        <CardCaption style={{ textAlign: "center" }}>
          {props.item.name}
        </CardCaption>
      </Cell>
    </div>
  );
};

export default DragSource(Types.ITEM, itemSource, collect)(ObjectThumbnail);
