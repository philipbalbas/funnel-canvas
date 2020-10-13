import React, { useEffect, useState } from 'react';
import { Stage, Layer, Text } from 'react-konva';
import Node from './Node';
import useImage from 'use-image';
import TextareaAutosize from 'react-textarea-autosize';
import { useStore } from './store';
import { ActionTypes, Current, State } from './Node/types';

const App = () => {
  const [innerWidth, setInnerWidth] = useState<number | undefined>();
  const [innerHeight, setInnerHeight] = useState<number | undefined>();

  // let [image] = useImage('/envelope-regular.svg');
  const current = useStore((state: State) => state.current);
  const data = useStore((state: State) => state.data);
  const nodes = useStore((state) => state.nodes);
  const dispatch = useStore((state) => state.dispatch);

  useEffect(() => {
    setInnerHeight(window.innerHeight);
    setInnerWidth(window.innerWidth);
  }, []);

  return (
    <>
      <div>
        {current} {data.id ? data.id : ''}
      </div>
      <Stage
        width={innerWidth}
        height={innerHeight}
        style={{
          cursor: data.cursor,
        }}
      >
        <Layer>
          {nodes.map((node) => (
            <Node
              key={node.id}
              id={node.id}
              left={node.left}
              top={node.top}
              icon={node.icon}
              caption={node.caption}
              isActive={current === Current.Select && data.id === node.id}
              isEditing={current === Current.Edit && data.id === node.id}
              onChange={() => {}}
              width={node.width}
            />
          ))}
          <Text text="Some text on canvas" fontSize={15} />
        </Layer>
      </Stage>
      <TextareaAutosize
        value={data.text || ''}
        style={{
          display: current === Current.Edit ? 'block' : 'none',
          position: 'absolute',
          top: `${data.y}px`,
          left: `${data.x}px`,
          width: `${data.width}px`,
          textAlign: 'center',
          outline: 'none',
          resize: 'none',
        }}
        onChange={(e) =>
          dispatch({
            type: ActionTypes.EditCaption,
            payload: {
              text: e.target.value,
            },
          })
        }
        onKeyDown={(e) => {
          console.log(e.key);
          if (e.key === 'Enter') {
            dispatch({ type: ActionTypes.FinishEdit });
          }
          if (e.key === 'Escape') {
            dispatch({ type: ActionTypes.CancelEdit });
          }
        }}
      />
    </>
  );
};

export default App;
