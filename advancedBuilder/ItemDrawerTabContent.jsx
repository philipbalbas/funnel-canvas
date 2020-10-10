import _ from "lodash";
import { Cell, Grid, Tab, Tabs } from "@sc/components/ui";
import { AppConfig } from "@sc/modules/app";
import React, { Component } from "react";

import ObjectThumbnail from "./ObjectThumbnail";
import { triggerHook } from "@sc/plugins";

/**
 * This represents a draggable section thumbnail object in the Item Drawer
 * that users can drag over to the canvas
 * @param {object} props The props
 * @returns {function} The component
 */

class ItemDrawerTabContent extends Component {
  static contextType = AppConfig;

  render() {
    const { objects, title, hint, tabs, activeTab, setActiveTab } = this.props;

    console.log({ objects });

    const settings = this.context;

    const PluginComponent = _.head(
      triggerHook("onComponentRender", {
        id: "PagesDrawer",
        activeTab,
      })
    );

    console.log({ PluginComponent });

    return (
      <>
        <div
          style={{
            borderBottom: "1px solid #ccc",
            textAlign: "center",
            backgroundColor: "#F0F0F0",
          }}
        >
          <h2 style={{ padding: 30 }}>{title}</h2>
          {_.get(tabs, "length", false) > 1 && (
            <Tabs transparent>
              {_.map(tabs, (tab) => (
                <Tab
                  active={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </Tab>
              ))}
            </Tabs>
          )}
        </div>
        <div
          style={{
            padding: 15,
            textAlign: "center",
            position: "fixed",
            top: _.get(tabs, "length", false) > 1 ? 150 : 110,
            overflowY: "scroll",
            bottom: 0,
            width: 400,
          }}
        >
          {hint && (
            <Grid justify="center" style={{ margin: 10 }}>
              <Cell align="center" style={{ margin: 5 }}>
                <img
                  alt="drag widget hint"
                  src={`${settings.app.assetsLocation}/images/drag_widget_hint.png`}
                />
              </Cell>
              <Cell align="center" style={{ margin: 5 }}>
                <p
                  style={{
                    textAlign: "center",
                    fontSize: 11,
                    marginTop: 5,
                    textTransform: "uppercase",
                  }}
                  dangerouslySetInnerHTML={{ __html: hint }}
                />
              </Cell>
            </Grid>
          )}

          {PluginComponent && <PluginComponent {...this.props} />}

          <Grid
            wrap
            justify="space-between"
            style={{
              width: "90%",
              margin: "0 auto",
            }}
          >
            {_.map(objects, (obj) => {
              return (
                <ObjectThumbnail
                  {...this.props}
                  item={obj}
                  key={obj.id}
                  closeDrawer={this.props.onClose}
                  settings={{ ...obj, connectToIds: [] }}
                />
              );
            })}
          </Grid>
        </div>
      </>
    );
  }
}

ItemDrawerTabContent.propTypes = {};

ItemDrawerTabContent.defaultProps = {};

export default ItemDrawerTabContent;
