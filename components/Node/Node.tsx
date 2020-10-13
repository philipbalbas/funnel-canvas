import { Group as IGroup } from 'konva/types/Group';
import { Text as IText } from 'konva/types/shapes/Text';
import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { Group, Rect, Text, Image } from 'react-konva';
import useImage from 'use-image';
import { useStore } from '../store';
import { ActionTypes } from './types';

type position = {
  x: number;
  y: number;
};

export interface INodeProps {
  id: string;
  icon?: string;
  caption?: string;
  isEditing?: boolean;
  readOnly?: boolean;
  left: number;
  top: number;
  width: number;
  height: number;
  style?: CSSProperties;
  fill?: string;
  isActive?: boolean;
  data?: string;
  children?: JSX.Element;
  onChange(arg0: string): void;
  onActivate?(): void;
  onOpen?(): void;
  onSelect?(): void;
  onDelete?(): void;
  onDuplicate?(): void;
  onArrowConnect?(): void;
  onArrowDisconnect?(): void;
  onContextMenu?(): void;
}

/**
 * The default node component rendered in the canvas
 * @param props
 */
const Node = (props: INodeProps) => {
  /**
   * Method for setting the node data
   * Inherited from the host canvas
   */
  let setData = () => {};
  let [pos, setPos] = useState(0);

  // const { dispatch } = useContext(context);

  /**
   * Activates any node that this node is connected to
   * Inherited from the host canvas
   * @param payload
   */
  // let activateConnectedNodes = (payload) => {};

  let groupRef = useRef<IGroup>(null);
  let textRef = useRef<IText>(null);

  let [image] = useImage(props.icon || '');

  console.log('image', image);

  useEffect(() => {
    props.onChange(props.data || '');
  }, [props.data]);

  useEffect(() => {
    let groupSize = groupRef.current?.getSize();
    let groupHalf = (groupSize?.width || 0) / 2;

    let textSize = textRef.current?.getSize();
    let textHalf = (textSize?.width || 0) / 2;

    let correctTextPosition = groupHalf - textHalf;
    setPos(correctTextPosition);
  });

  let dispatch = useStore((state) => state.dispatch);

  let handleClick = () => {
    dispatch({
      type: ActionTypes.SelectNode,
      payload: {
        id: props.id,
      },
    });
  };

  let handleDragStart = () => {
    !props.readOnly &&
      dispatch({
        type: ActionTypes.DragNodeStart,
        payload: {
          id: props.id,
        },
      });
  };

  useEffect(() => {}, [textRef]);
  return (
    <Group
      x={props.left}
      y={props.top}
      draggable={!props.readOnly}
      name={props.id}
      onDragStart={handleDragStart}
      onDragEnd={(e) => {
        dispatch({
          type: ActionTypes.DragNodeEnd,
          payload: {
            id: props.id,
            x: e.target.x(),
            y: e.target.y(),
          },
        });
      }}
      width={props.width}
      height={props.height}
      ref={groupRef}
    >
      <Rect
        // onMouseOver={() => {
        //   dispatch({
        //     type: Current.Hover,
        //     payload: {
        //       id: props.id,
        //     },
        //   });
        // }}
        // on={() => {
        //   dispatch({ type: Current.Idle });
        // }}

        stroke={props.isActive ? '#0082d2' : '#ccc'}
        strokeWidth={1}
        width={props.width}
        height={props.height}
        onClick={handleClick}
      />
      <Rect
        // onMouseEnter={() => {
        //   dispatch({
        //     type: Current.Hover,
        //     payload: {
        //       id: props.id,
        //     },
        //   });
        // }}

        width={props.width - 5}
        height={props.height - 5}
        fill={props.fill ?? ''}
        x={2.5}
        y={2.5}
        onClick={handleClick}
      />
      {image && (
        <Image
          image={image}
          width={100}
          height={100}
          x={45}
          y={25}
          onClick={handleClick}
        />
      )}
      <Text
        ref={textRef}
        text={props.caption}
        y={props.height + 10}
        x={pos}
        // onMouseOver={() => {
        //   dispatch({ type: ActionTypes.HoverText });
        // }}
        // onMouseLeave={() => {
        //   dispatch({ type: ActionTypes.ExitHover })
        // }}
        onDblClick={() => {
          if (!props.readOnly) {
            let textNode = textRef.current;
            let stage = textNode?.getStage();
            let textPosition = textNode?.getAbsolutePosition();

            let stageBox = stage?.container().getBoundingClientRect();
            let group = textNode?.getParent();
            let groupPosition = group?.getAbsolutePosition();
            let groupSize = group?.getSize();

            let areaPosition = {
              x: groupPosition?.x || 0,
              y: (stageBox?.top || 0) + (textPosition?.y || 0),
            };
            dispatch({
              type: ActionTypes.OpenTextEditBox,
              payload: {
                id: props.id,
                x: areaPosition.x,
                y: areaPosition.y,
                text: props.caption || '',
                width: groupSize?.width || 0,
              },
            });
          }
        }}
      />
    </Group>
  );
};

Node.defaultProps = {
  top: 20,
  left: 20,
  width: 200,
  height: 150,
};

export default Node;
