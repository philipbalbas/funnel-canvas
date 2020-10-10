import { FontIcon, ListItem, Menu } from "@sc/components/ui";
import theme from "@sc/components/ui/theme";
import _ from "lodash";
import React, { Component } from "react";
import { objects, style } from "../shared";
import ConnectionArrow from "./ConnectionArrow";
import { AppConfig } from "../../app";
import { triggerHook } from "@sc/plugins";
import styled from "styled-components";

class Obj extends Component {
  constructor(props) {
    super(props);

    this.handleComponentClick = this.handleComponentClick.bind(this);
    this.handleComponentDoubleClick = this.handleComponentDoubleClick.bind(
      this
    );
  }

  handleComponentClick(e) {
    const { settings, match, history, setActiveObject } = this.props;

    setActiveObject(settings);
    triggerHook(
      "onNodeSelect",
      { type: settings.type },
      { settings, campaignId: match.params.campaignId },
      { navigate: history.push }
    );
  }

  handleComponentDoubleClick(e) {
    const {
      settings,
      match,
      history,
      setActiveObject,
      showPopup,
      updateCampaignObjectMutation,
      updatePageSettings,
      updateObjectSettings
    } = this.props;

    console.log("double click");
    setActiveObject(settings);

    triggerHook(
      "onNodeOpen",
      { type: settings.type },
      { settings, campaignId: match.params.campaignId },
      {
        showPopup,
        navigate: history.push,
        updateObject: async variables =>
          await updateCampaignObjectMutation({ variables }),
        updateObjectSettings: async variables =>
          await updateObjectSettings({ variables }),
        updatePageSettings: async variables =>
          await updatePageSettings({ variables })
      }
    );
  }

  render() {
    return (
      <div
        style={style.component}
        onClick={this.handleComponentClick}
        onDoubleClick={this.handleComponentDoubleClick}
      >
        <AppConfig>
          {({ app }) => {
            const {
              getCampaignState,
              setCampaignState,
              settings,
              activeObject
            } = this.props;
            const { height, screenshot, type, id, page } = settings;

            let thumbnail = screenshot;
            let thumbMatch;

            if (!thumbnail) {
              if (type === "PageComponent") {
                thumbMatch = _.head(
                  _.filter(objects.pages, itm => itm.pageType === page.type)
                );
              }
              thumbnail = _.get(thumbMatch, "screenshot", app.logoIcon);
            }

            const Div = styled.div`
              border: ${_.get(activeObject, "id") === id
                ? `1px solid ${theme.primaryColor}`
                : "1px solid transparent"};
              margin: -1px;
              ${_.get(activeObject, "id") !== id &&
                `
                &:hover {
                  border: 1px solid ${theme.altColor[4]};
                }
              `}
            `;

            const getComponentFromPlugin = triggerHook(
              "onComponentRender",
              { id: "CanvasObject" },
              settings,
              { getCampaignState, setCampaignState }
            );

            return (
              <>
                <ConnectionArrow
                  {...this.props}
                  hidden={!this.props.overlayShow}
                />
                <Div style={{ padding: 3 }}>
                  <div
                    style={{
                      ...style.objStyle,
                      height: height - 8,
                      backgroundSize:
                        type === "RedirectComponent" ||
                        type === "TrackingSource" ||
                        type === "AnotherFunnelComponent" ||
                        type === "ABSplitComponent"
                          ? "cover"
                          : "auto",
                      backgroundImage: `url(${thumbnail})`,
                      backgroundColor: theme.altColor[7]
                    }}
                  >
                    {getComponentFromPlugin.length
                      ? React.createElement(
                          _.head(getComponentFromPlugin),
                          this.props
                        )
                      : null}
                  </div>
                </Div>
              </>
            );
          }}
        </AppConfig>
      </div>
    );
  }
}

export default class CampaignObject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newName: props.settings.name,
      isFocused: false,
      // nameShow: false,
      overlayShow: false,
      highlightObject: false
    };

    this.doUpdate = this.doUpdate.bind(this);

    this.showCampaignObjectOverlay = this.showCampaignObjectOverlay.bind(this);
    this.hideCampaignObjectOverlay = this.hideCampaignObjectOverlay.bind(this);

    this.showCampaignObjectHighlight = this.showCampaignObjectHighlight.bind(
      this
    );
    this.hideCampaignObjectHighlight = this.hideCampaignObjectHighlight.bind(
      this
    );

    this.doDuplicate = this.doDuplicate.bind(this);
    this.doDelete = this.doDelete.bind(this);
  }

  componentDidUpdate() {
    if (this.props.isEditing && !this.state.isFocused) {
      this.textInput.select();
      this.setState({ isFocused: true });
    }
  }

  showCampaignObjectOverlay() {
    this.setState(() => ({ overlayShow: true }));
  }

  hideCampaignObjectOverlay() {
    this.setState(() => ({ overlayShow: false }));
  }

  showCampaignObjectHighlight() {
    this.setState(prevState => {
      if (!prevState.highlightObject) return { highlightObject: true };
    });
  }

  hideCampaignObjectHighlight() {
    this.setState(prevState => {
      if (prevState.highlightObject) return { highlightObject: false };
    });
  }

  doUpdate() {
    this.props.updateCanvasObject(this.props.settings.id, {
      ...this.props.settings,
      name: this.state.newName
    });

    console.log("obj update", this.props.settings);

    // if page component, update name of page
    if (this.props.settings.type === "PageComponent") {
      const pageId = this.props.settings.page.id;

      this.props.updatePageName({
        variables: {
          pageId,
          name: this.state.newName
        }
      });
    }

    this.setState(prevState => ({ isFocused: false }));
    this.props.hideNameEditor();
  }

  doDuplicate() {
    this.props.duplicateCanvasObject(this.props.settings.id);
  }

  doDelete() {
    this.props.removeCanvasObject(this.props.settings.id);
  }

  render() {
    const {
      isDragging,
      connectDragSource,
      connectDropTarget,
      settings,
      isEditing,
      showNameEditor
    } = this.props;
    const { overlayShow, highlightObject, newName } = this.state;

    if (isDragging) return null;

    return connectDropTarget(
      connectDragSource(
        <div
          style={{
            ...style.defaultComponent(),
            left: settings.x,
            top: settings.y,
            width: settings.width,
            height: settings.height,
            zIndex: 1
          }}
          onDragOver={this.showCampaignObjectHighlight}
          onDragLeave={this.hideCampaignObjectHighlight}
          onDrop={this.hideCampaignObjectHighlight}
          onMouseEnter={this.showCampaignObjectOverlay}
          onMouseLeave={this.hideCampaignObjectOverlay}
          // onDragStart={this.hideCampaignObjectOverlay}
          // onDragEnd={this.showCampaignObjectOverlay}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
              position: "relative",
              marginBottom: 5,
              backgroundColor: highlightObject
                ? style.connectionLineColor
                : "inherit"
            }}
          >
            <Obj {...this.props} overlayShow={overlayShow} />
          </div>
          <div style={{ cursor: "text", marginLeft: -13 }}>
            {isEditing ? (
              <input
                style={{ padding: 0, textAlign: "center" }}
                onBlur={this.doUpdate}
                onChange={e => this.setState({ newName: e.target.value })}
                defaultValue={newName}
                ref={input => {
                  this.textInput = input;
                }}
              />
            ) : (
              <p style={{ display: "inline" }} onClick={showNameEditor}>
                {settings.name}
              </p>
            )}
            <div
              style={{
                display: "inline",
                position: "absolute",
                marginLeft: 7,
                marginTop: -8,
                cursor: "pointer"
              }}
            >
              <Menu
                position="BOTTOM_RIGHT"
                id="avatar-menu"
                icon={
                  <FontIcon
                    className="arrdropdown"
                    style={{ zoom: "70%", color: "black" }}
                  >
                    arrow_drop_down
                  </FontIcon>
                }
              >
                <ListItem
                  onClick={e => {
                    e.stopPropagation();
                    this.doDelete();
                  }}
                >
                  Delete
                </ListItem>
              </Menu>
            </div>
          </div>
        </div>
      )
    );
  }
}
