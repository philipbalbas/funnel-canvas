import _ from "lodash";
import React, { Component } from "react";
import { DragSource, DropTarget } from "react-dnd";
import CampaignObject from "./CampaignObject";

const Types = { ITEM: "node" };

const itemSource = {
  beginDrag(props) {
    return props;
  },
  canDrag(props) {
    return !props.isEditing;
  }
};

const itemTarget = {
  hover(props, monitor) {
    // snap line to center
    const originObject = _.get(monitor.getItem(), "settings");
    const destinationObject = _.get(props, "settings");

    const originId = originObject.id;
    const destinationId = destinationObject.id;

    // find out if they're already connected
    const { campaignContent } = props;
    const liveOriginObject = campaignContent.filter(itm => itm.id === originId);

    if (liveOriginObject.length) {
      const connectTo = _.get(liveOriginObject, "0.connectTo", false);
      if (connectTo) {
        if (
          connectTo.findIndex(itm => itm.id === destinationId) === -1 &&
          originId !== destinationId
        ) {
          props.connectObjects(originId, destinationId, false);
          console.log({ originObject }, { destinationObject });
        }
      }
    }
  },

  drop(props, monitor) {
    console.log("ARROW WAS DROPPED ON OBJECT");
    // create an arrow connection
    const originObject = monitor.getItem().settings;
    const destinationObject = props.settings;

    const originId = originObject.id;
    const destinationId = destinationObject.id;

    if (originId !== destinationId) {
      setTimeout(() => props.connectObjects(originId, destinationId, true), 50);
    }
  },

  canDrop(props, monitor) {
    return monitor.getItem().type === "arrow";
  }
};

const collectSource = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
  connectDragPreview: connect.dragPreview()
});

const collectTarget = connect => ({
  connectDropTarget: connect.dropTarget()
});

export default class ObjectThumbnailContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false
    };
    this.showNameEditor = this.showNameEditor.bind(this);
    this.hideNameEditor = this.hideNameEditor.bind(this);
  }
  showNameEditor() {
    this.setState(prevState => ({
      isEditing: true
    }));
  }
  hideNameEditor() {
    this.setState(prevState => ({
      isEditing: false
    }));
  }
  render() {
    return (
      <TargetContainer
        {...this.props}
        isEditing={this.state.isEditing}
        showNameEditor={this.showNameEditor}
        hideNameEditor={this.hideNameEditor}
      />
    );
  }
}

const CObject = DragSource(Types.ITEM, itemSource, collectSource)(
  CampaignObject
);

const TargetContainer = DropTarget(Types.ITEM, itemTarget, collectTarget)(
  CObject
);
