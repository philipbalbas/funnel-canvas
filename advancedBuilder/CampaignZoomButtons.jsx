import { Button } from "@sc/components/ui";
import React from "react";
import { style } from "../shared";

export const CampaignZoomButtons = props => {
  return (<div style={style.zoomButtons}>
    <Button icon negative onClick={props.onZoomIn}>add</Button>
    <div style={{ padding: 3 }} />
    <Button icon negative onClick={props.onZoomOut}>remove</Button>
  </div>);
};
