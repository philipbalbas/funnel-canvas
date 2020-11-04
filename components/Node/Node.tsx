import { Group as IGroup } from 'konva/types/Group';
import { Text as IText } from 'konva/types/shapes/Text';
import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { Group, Rect, Text, Image, Arc } from 'react-konva';
import useImage from 'use-image';
import ConnectionLine from '../ConnectionLine';
import { useStore } from '../store';
import { ActionTypes, connectingLine, Current, HoverItem } from './types';

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
  connectingLines: connectingLine[];
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
  let [outerRef, setOuterRef] = useState<IGroup | null>();
  // let [width, ]

  // const { dispatch } = useContext(context);

  /**
   * Activates any node that this node is connected to
   * Inherited from the host canvas
   * @param payload
   */
  // let activateConnectedNodes = (payload) => {};

  let outerGroupRef = useRef<IGroup>(null);
  let innerGroupRef = useRef<IGroup>(null);
  let textRef = useRef<IText>(null);

  useEffect(() => {
    setOuterRef(outerGroupRef.current);
  }, [outerGroupRef.current]);

  let [image] = useImage(props.icon || '');

  useEffect(() => {
    props.onChange(props.data || '');
  }, [props.data]);

  // console.log(outerRef);
  // useEffect(() => {
  //   console.log(props.left, props.top);
  // }, [props.left, props.top]);

  // useEffect(() => {
  //   console.log('real X', outerGroupRef.current?.x());
  // }, [outerGroupRef.current]);

  useEffect(() => {
    let groupSize = outerGroupRef.current?.getSize();
    let groupHalf = (groupSize?.width || 0) / 2;

    let textSize = textRef.current?.getSize();
    let textHalf = (textSize?.width || 0) / 2;

    let correctTextPosition = groupHalf - textHalf;

    setPos(correctTextPosition);
  });

  let dispatch = useStore((state) => state.dispatch);
  let data = useStore((state) => state.data);

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

  // useEffect(() => {
  //   console.log(outerGroupRef.current?.x());
  // }, [outerGroupRef.current]);
  // console.log('width', outerGroupRef.current?.getSize().width);
  return (
    <Group
      x={props.left}
      y={props.top}
      id={props.id}
      name={`Node-${props.id}`}
      ref={outerGroupRef}
      width={props.width}
      height={props.height}
      onDragEnd={(e) => {
        if (e.target.x() !== 0) {
          dispatch({
            type: ActionTypes.DragNodeEnd,
            payload: {
              id: props.id,
              x: e.target.x(),
              y: e.target.y(),
            },
          });
        }
      }}
    >
      <Group
        onMouseEnter={() => {
          dispatch({
            type: ActionTypes.HoverNodeEnter,
          });
        }}
        ref={innerGroupRef}
        draggable={!props.readOnly}
        onMouseLeave={() => {
          dispatch({
            type: ActionTypes.HoverNodeExit,
          });
        }}
        onDragStart={(e) => {
          e.target.stopDrag();
          const group = e.target.parent;
          group?.startDrag();
          dispatch({
            type: ActionTypes.DragNodeStart,
            payload: {
              id: props.id,
            },
          });
        }}
      >
        <Rect
          stroke={props.isActive ? '#0082d2' : '#ccc'}
          strokeWidth={1}
          width={props.width}
          height={props.height}
          onClick={handleClick}
        />
        <Rect
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
      </Group>
      <Text
        ref={textRef}
        text={props.caption}
        y={props.height + 10}
        x={pos}
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
      <Arc
        x={outerGroupRef.current?.getSize().width}
        y={(outerGroupRef.current?.getSize().height || 0) / 2}
        innerRadius={0}
        outerRadius={30}
        angle={180}
        rotation={90}
        stroke={
          props.id === data.id && data.hoverItem === HoverItem.AnchorRight
            ? '#00D2FF'
            : ''
        }
        onMouseEnter={() => {
          dispatch({
            type: ActionTypes.HoverAnchorEnter,
            payload: {
              anchorItem: HoverItem.AnchorRight,
              id: props.id,
            },
          });
        }}
        onMouseLeave={() => {
          dispatch({
            type: ActionTypes.HoverAnchorExit,
          });
        }}
        onMouseDown={() => {
          dispatch({
            type: ActionTypes.CreateArrowStart,
            payload: {
              x: outerGroupRef.current?.getSize().width ?? 0,
              y: (outerGroupRef.current?.getSize().height ?? 0) / 2,
            },
          });
        }}
        onMouseUp={() => {
          console.log('up');
        }}
      />
      <Arc
        x={0}
        y={(outerGroupRef.current?.getSize().height || 0) / 2}
        innerRadius={0}
        outerRadius={30}
        angle={180}
        rotation={270}
        stroke={
          props.id === data.id && data.hoverItem === HoverItem.AnchorLeft
            ? '#00D2FF'
            : ''
        }
        onMouseEnter={() => {
          dispatch({
            type: ActionTypes.HoverAnchorEnter,
            payload: {
              anchorItem: HoverItem.AnchorLeft,
              id: props.id,
            },
          });
        }}
        onMouseLeave={() => {
          dispatch({
            type: ActionTypes.HoverAnchorExit,
          });
        }}
        onClick={(e) => {
          console.log('drawing');
        }}
      />
      <Arc
        x={(outerGroupRef.current?.getSize().width || 0) / 2}
        y={0}
        innerRadius={0}
        outerRadius={30}
        angle={180}
        rotation={0}
        stroke={
          props.id === data.id && data.hoverItem === HoverItem.AnchorUp
            ? '#00D2FF'
            : ''
        }
        onMouseEnter={() => {
          dispatch({
            type: ActionTypes.HoverAnchorEnter,
            payload: {
              anchorItem: HoverItem.AnchorUp,
              id: props.id,
            },
          });
        }}
        onMouseLeave={() => {
          dispatch({
            type: ActionTypes.HoverAnchorExit,
          });
        }}
      />
      <Arc
        x={(outerGroupRef.current?.getSize().width || 0) / 2}
        y={outerGroupRef.current?.getSize().height}
        innerRadius={0}
        outerRadius={30}
        angle={180}
        rotation={180}
        stroke={
          props.id === data.id && data.hoverItem === HoverItem.AnchorDown
            ? '#00D2FF'
            : ''
        }
        onMouseEnter={() => {
          dispatch({
            type: ActionTypes.HoverAnchorEnter,
            payload: {
              anchorItem: HoverItem.AnchorDown,
              id: props.id,
            },
          });
        }}
        onMouseLeave={() => {
          dispatch({
            type: ActionTypes.HoverAnchorExit,
          });
        }}
      />
      {props.connectingLines?.map((line) => {
        let dest = outerRef
          ?.getParent()
          .children.toArray()
          .find((node) => node.attrs.id === line.destinationId);

        console.log('heihgt', dest?.attrs.height, dest?.attrs.y || 0);
        let x1 = props.width;
        let y1 = props.height / 2;
        let x2 = dest?.attrs.x || 0;
        let y2 = dest?.attrs.y || 0;
        return <ConnectionLine x1={x1} y1={y1} x2={x2} y2={y2} />;
      })}
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
