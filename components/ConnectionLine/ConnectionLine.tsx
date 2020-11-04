import React, { useState } from 'react';
import { Arc, Arrow, Circle, Group, Shape } from 'react-konva';
import { IConnectionLineProps } from './types';

const ConnectionLine = (props: IConnectionLineProps) => {
  // const [props.x1, setX1] = useState(props.props.x1);
  // const [props.y1, setY1] = useState(props.props.y1);
  // const [props.x2, setX2] = useState(props.props.x2);
  // const [y2, sety2] = useState(props.y2);
  console.log('inside', props.x2, props.y2);
  return (
    <Group>
      {/* <Circle
        x={props.x1}
        y={props.y1}
        radius={10}
        stroke="#666"
        strokeWidth={1}
        draggable
        onDragMove={(e) => {
          setX1(e.target.x());
          setY1(e.target.y());
        }}
      /> */}
      <Arrow
        x={props.x2}
        y={props.y2}
        pointerLength={11}
        pointerWidth={15}
        fill="#00d2ff"
        stroke="#00d2ff"
        points={[0, 0, 15, 0]}
        draggable
        // onDragMove={(e) => {
        //   setX2(e.target.x());
        //   sety2(e.target.y());
        // }}

        // strokeWidth={2}ß
      />
      <Shape
        sceneFunc={(context, shape) => {
          context.beginPath();
          context.moveTo(props.x1, props.y1);

          const distanceWidth = Math.abs(props.x2 - props.x1) + 100;

          let c1x = props.x1 + distanceWidth / 4;
          let c2x = props.x2 - distanceWidth / 4;

          context.bezierCurveTo(
            c1x,
            props.y1,
            c2x,
            props.y2,
            props.x2,
            props.y2
          );
          context.fillStrokeShape(shape);
          context.closePath();
        }}
        stroke="#00D2FF"
        strokeWidth={2}
      />
    </Group>
  );
};

export default ConnectionLine;
