import { triggerHook } from "@sc/plugins";
import { head, filter, map } from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";
import {
  CardCaption,
  Cell,
  Drawer,
  FontIcon,
  Grid,
  Tab,
  Tabs,
} from "@sc/components/ui";
import theme from "@sc/components/ui/theme";

const gutterStyle = {
  width: 80,
  backgroundColor: "#EEE",
  borderRight: "1px solid #DDD",
};

/**
 * This is a sidebar that slides out to reveal all the various
 * items/widgets that can be dragged to the canvas
 * @param {object} props The props
 * @returns {function} The component
 */
class ItemDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: props.tab,
    };
    this.switchTab = this.switchTab.bind(this);
  }

  switchTab(activeTab) {
    this.setState({ activeTab });
  }

  render() {
    if (!this.props.hidden) {
      const tabs = triggerHook("onListItems", { id: "CanvasItemDrawerTabs" });

      return (
        <Drawer
          {...this.props}
          overlay={false}
          style={{ ...this.props.style, width: 480 }}
          onClose={this.props.onClose}
        >
          <Grid
            style={{
              width: "100%",
              position: "absolute",
              zIndex: -1,
              height: "100vh",
            }}
          >
            <Cell style={gutterStyle}>
              <Tabs vertical transparent>
                {map(tabs, (tab) => (
                  <Tab
                    active={this.state.activeTab === tab.id}
                    onClick={() => this.switchTab(tab.id)}
                  >
                    <div
                      style={{ textAlign: "center", color: theme.darkColor }}
                    >
                      <FontIcon style={{ margin: 8 }}>{tab.icon}</FontIcon>
                      <CardCaption style={{ fontSize: 11 }}>
                        {tab.caption}
                      </CardCaption>
                    </div>
                  </Tab>
                ))}
              </Tabs>
            </Cell>
            <Cell style={{ width: 400 }}>
              {React.createElement(
                head(filter(tabs, (tab) => tab.id === this.state.activeTab))[
                  "component"
                ],
                this.props
              )}
            </Cell>
          </Grid>
        </Drawer>
      );
    }
    return null;
  }
}

ItemDrawer.propTypes = {
  /** Boolean whether or not to display the section */
  hidden: PropTypes.bool,
  onClose: PropTypes.func,
  tab: PropTypes.string,
};
ItemDrawer.defaultProps = {
  /** Boolean whether or not to display the section */
  hidden: false,
  tab: "ELEMENTS",
};

export default ItemDrawer;
