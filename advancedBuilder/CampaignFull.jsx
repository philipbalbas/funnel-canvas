import { Button } from '@sc/components/ui';
import { AppConfig } from '@sc/modules/app';
import _ from 'lodash';
import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import { functions, style } from '../shared';
import ConnectionLine from './ConnectionLine';
import ItemDrawer from './ItemDrawer';
import { CampaignZoomButtons } from './CampaignZoomButtons';
import ObjectThumbnailContainer from './ObjectThumbnailContainer';

const { toggleItemDrawer, closeItemDrawer } = functions;

const Types = { ITEM: 'node' };

const itemTarget = {
  hover(props, monitor) {
    const item = monitor.getItem();
    const originalPosition = monitor.getInitialSourceClientOffset();
    const offsetPosition = monitor.getDifferenceFromInitialOffset();

    const x = Math.round(
      originalPosition.x + offsetPosition.x + window.scrollX
    );
    const y = Math.round(
      originalPosition.y + offsetPosition.y + window.scrollY
    );

    // only update if 10px change from previous hover snapshot (for speed purposes)
    const snap = 30;
    if (
      Math.abs(monitor.getItem().x - x) < snap &&
      Math.abs(monitor.getItem().y - y) < snap
    )
      return;

    if (item.type === 'arrow') {
      // find the key (where the connectTo object does not have an id)
      const connectTo = _.get(item, 'settings.connectTo', []) || [];

      // console.log({ settings: item.settings, connectTo });

      const findNoId = _.findIndex(connectTo, (itm) => itm.id === undefined);

      const key = findNoId === -1 ? connectTo.length : findNoId;

      const newSettings = {
        ...item.settings,
        connectTo: [
          ...connectTo.slice(0, key),
          { x, y },
          ...connectTo.slice(key + 1),
        ],
      };

      props.updateCanvasObject(item.settings.id, newSettings, false);

      monitor.getItem().x = x;
      monitor.getItem().y = y;
    } else if (item.type !== 'arrow') {
      const m = monitor.getItem();
      if (_.has(m, 'closeDrawer')) {
        m.closeDrawer();
      }

      // move the item (without saving)
      // item.updateCanvasObject(item.settings.id, { ...item.settings, x, y }, false);
    }
  },

  drop(props, monitor) {
    const item = monitor.getItem();

    if (item.type === 'arrow') {
      console.log('ARROW DROPPED', item.settings);

      // Clean up any temporary lines
      props.updateCanvasObject(
        item.settings.id,
        {
          ...item.settings,
          connectTo: _.filter(item.settings.connectTo, (itm) =>
            _.has(itm, 'id')
          ),
        },
        false
      );
    } else if (item.type !== 'arrow') {
      console.log('OBJECT DROPPED', { item });
      const originalPosition = monitor.getInitialSourceClientOffset();
      const offsetPosition = monitor.getDifferenceFromInitialOffset();
      // const originalPosition = { x: 0, y: 0 };
      // const offsetPosition = { x: 0, y: 0 };

      const x = Math.round(
        originalPosition.x + offsetPosition.x + window.scrollX
      );
      const y = Math.round(
        originalPosition.y + offsetPosition.y + window.scrollY
      );

      if (
        props.campaignContent.findIndex((itm) => itm.id === item.settings.id) >
        -1
      ) {
        item.updateCanvasObject(item.settings.id, { ...item.settings, x, y });
      } else {
        item.addCanvasObject({ ...item.settings, x, y });
      }
    }
  },
};

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
});

class CampaignFull extends Component {
  constructor(props) {
    super(props);

    this.state = {
      itemDrawerVisible: false,
      propertiesDrawerVisible: false,
      zoom: 1,
    };

    this.toggleItemDrawer = toggleItemDrawer.bind(this);
    this.closeItemDrawer = closeItemDrawer.bind(this);

    this.handleZoomIn = this.handleZoomIn.bind(this);
    this.handleZoomOut = this.handleZoomOut.bind(this);
  }

  static contextType = AppConfig;

  componentDidMount() {
    // console.log("I AM FULL!!!");
    localStorage.setItem('builderType', 'editor');
  }

  handleZoomIn() {
    this.setState((prevState) => ({ zoom: prevState.zoom + 0.1 }));
  }

  handleZoomOut() {
    this.setState((prevState) => ({ zoom: prevState.zoom - 0.1 }));
  }

  render() {
    const { connectDropTarget, getCampaignState } = this.props;
    const { zoom } = this.state;

    const settings = this.context;

    const objects = this.props.campaignContent || [];

    const content = (
      <div style={{ height: '100vh' }}>
        <ItemDrawer
          {...this.props}
          tab="PAGES"
          onClose={this.closeItemDrawer}
          hidden={!this.state.itemDrawerVisible}
        />

        <Button
          style={style.addButton}
          icon
          secondary
          onClick={this.toggleItemDrawer}
        >
          add
        </Button>

        <CampaignZoomButtons
          onZoomIn={this.handleZoomIn}
          onZoomOut={this.handleZoomOut}
        />

        <div
          style={{ paddingLeft: 0, zoom }}
          onClick={() => this.props.setActiveObject(false)}
        >
          {objects.map((obj) => (
            <ObjectThumbnailContainer
              {...this.props}
              key={obj.id}
              settings={{
                ...obj,
                width: obj.width || settings.app.defaultObjectWidth,
                height: obj.height || settings.app.defaultObjectHeight,
              }}
            />
          ))}

          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{
              height: '500vh',
              width: '500vh',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >
            <defs>
              <marker
                id="pointer"
                markerWidth="6"
                markerHeight="6"
                viewBox="-3 -3 6 6"
                refX="3"
                refY="0"
                markerUnits="strokeWidth"
                orient="auto"
              >
                <polygon
                  points="-1,0 -3,3 3,0 -3,-3"
                  fill={style.connectionLineColor}
                />
              </marker>
              <marker
                id="base"
                markerWidth="20"
                markerHeight="20"
                refX="0"
                refY="2.5"
                markerUnits="strokeWidth"
                orient="auto"
              >
                <rect
                  x="0"
                  y="-2"
                  rx="0"
                  ry="2"
                  width="2.5"
                  height="7"
                  fill={style.connectionLineColor}
                />
                <circle
                  cx="2.5"
                  cy="2.5"
                  r="2.5"
                  fill={style.connectionLineColor}
                />
              </marker>
            </defs>
            {this.props.campaignContent.map((obj) => {
              if (obj.hasOwnProperty('connectTo')) {
                if (obj.connectTo) {
                  return obj.connectTo.map((destination) => (
                    <ConnectionLine
                      key={Math.random()}
                      originId={obj.id}
                      destinationId={destination.id}
                      destination={destination}
                      campaignContent={this.props.campaignContent}
                      disconnectObjects={this.props.disconnectObjects}
                      getCampaignState={getCampaignState}
                    />
                  ));
                }
              }
              return null;
            })}
          </svg>
        </div>
      </div>
    );

    if (connectDropTarget) return connectDropTarget(content);
    else return content;
  }
}

export const JustCampaignFull = CampaignFull;
export default DropTarget(Types.ITEM, itemTarget, collect)(CampaignFull);
