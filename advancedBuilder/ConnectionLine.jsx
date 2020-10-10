import { head } from 'lodash'
import { AppConfig } from "@sc/modules/app";
import React, { Component } from "react";
import { style } from "../shared";
import { triggerHook } from "@sc/plugins";

class ConnectionLine extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showClose: false
    };

    this.showClose = this.showClose.bind(this);
    this.hideClose = this.hideClose.bind(this);
  }

  static contextType = AppConfig;

  showClose() {
    this.setState({
      showClose: true
    });
  }

  hideClose() {
    this.setState({
      showClose: false
    });
  }

  render() {
    const settings = this.context;

    const {
      campaignContent,
      originId,
      destinationId,
      disconnectObjects,
      destination,
      getCampaignState
    } = this.props;

    // 1. Grab the settings for the first object
    const originKey = campaignContent.findIndex(itm => itm.id === originId);
    const originObject = campaignContent[originKey];

    // 2. Grab the settings for the second object
    const destinationKey = campaignContent.findIndex(
      itm => itm.id === destinationId
    );
    let destinationObject = campaignContent[destinationKey];

    // 3. Make an adjustment if one of the objects is missing but mouseX or mouseY coordinates are sent
    if (destinationKey === -1) {
      destinationObject = {
        height: 1,
        width: 1,
        x: destination.x + 15,
        y: destination.y + 20
      };
    }

    if (destinationObject) {
      // replace with actual
      const originWidth = originObject.width
        ? originObject.width
        : settings.app.defaultObjectWidth;
      const originHeight = originObject.height
        ? originObject.height
        : settings.app.defaultObjectHeight;
      const destinationHeight = destinationObject.height
        ? destinationObject.height
        : settings.app.defaultObjectHeight;

      // 4. calculate the starting and ending x, y cordinates for your line
      const x1 = originObject.x + originWidth;
      const y1 = originObject.y + originHeight / 2;
      const x2 = destinationObject.x;
      const y2 = destinationObject.y + destinationHeight / 2;

      const distanceWidth = Math.abs(x2 - x1) + originWidth;

      // 5. return the line (see https://codepen.io/thebabydino/pen/EKLNvZ)
      const start = [x1, y1];
      const startCurve = [x1 + distanceWidth / 4, y1];
      const endCurve = [x2 - distanceWidth / 4, y2];
      const end = [x2, y2];

      const midPoint = [x1 + (x2 - x1) / 2, y1 + (y2 - y1) / 2];

      const M = start[0] && start[1] && `M${start[0]},${start[1]}`;
      const C =
        startCurve[0] && startCurve[1] && endCurve[0] && endCurve[1]
          ? `C${startCurve[0]},${startCurve[1]} ${endCurve[0]},${endCurve[1]}`
          : "";
      const theEnd = end[0] && end[1] ? `${end[0]},${end[1]}` : "";


      const getComponentFromPlugin = triggerHook(
        'onComponentRender',
        { id: 'ConnectionLine' },
        {},
        { getCampaignState }
      );

      return (
        <g onMouseEnter={this.showClose} onMouseLeave={this.hideClose}>
          <path
            d={`${M} ${C} ${theEnd}`}
            style={{
              ...style.polyline,
              stroke: style.connectionLineColor,
              strokeWidth: this.state.showClose ? 3 : style.polyline.strokeWidth
            }}
            markerStart="url(#base)"
            markerEnd="url(#pointer)"
          />

          {this.state.showClose ? (
            <g
              onClick={() => disconnectObjects(originId, destinationId)}
              style={{ cursor: "pointer" }}
            >
              <circle
                cx={midPoint[0]}
                cy={midPoint[1]}
                r="10"
                fill={style.connectionLineColor}
              />
              <line
                x1={midPoint[0] - 4}
                y1={midPoint[1] - 4}
                x2={midPoint[0] + 4}
                y2={midPoint[1] + 4}
                style={{ stroke: "white", strokeWidth: 3 }}
              />
              <line
                x1={midPoint[0] + 4}
                y1={midPoint[1] - 4}
                x2={midPoint[0] - 4}
                y2={midPoint[1] + 4}
                style={{ stroke: "white", strokeWidth: 3 }}
              />
            </g>
          ) : null}

          {
            getComponentFromPlugin.length && React.createElement(head(getComponentFromPlugin), { midPoint, fill: style.connectionLineColor })
          }

        </g>
      );
    }

    return null;
  }
}

export default ConnectionLine;
