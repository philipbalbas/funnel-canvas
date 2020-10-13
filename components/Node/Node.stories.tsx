// components/Node/Node.stories.ts
import React, { Fragment } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { Meta, Story } from '@storybook/react/types-6-0';
import Node, { INodeProps } from './Node';
import { Stage, Layer } from 'react-konva';
import { useStore } from '../store';
import { ActionTypes, Current } from './types';

export default {
  title: 'Node',
  component: Node,
  argTypes: {
    fill: { control: 'color' },
  },
} as Meta;

const defaultState = {
  id: '1',
  left: 200,
  top: 20,
  width: 200,
  height: 150,
  caption: 'Webinar',
  onChange: () => {},
  isActive: false,
  isEditing: false,
  fill: '',
  // onSelect: (id) =>
};

const Template: Story<INodeProps> = (args) => {
  const data = useStore((state) => state.data);
  const current = useStore((state) => state.current);
  const dispatch = useStore((state) => state.dispatch);
  return (
    <Fragment>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Node
            {...args}
            // isActive={current === Current.Select && data.id === args.id}
          />
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
          if (e.key === 'Enter') {
            dispatch({ type: ActionTypes.FinishEdit });
          }
          if (e.key === 'Escape') {
            dispatch({ type: ActionTypes.CancelEdit });
          }
        }}
      />
    </Fragment>
  );
};

export const Default = Template.bind({});
Default.args = {
  ...defaultState,
};

export const Icon = Template.bind({});
Icon.args = {
  ...defaultState,
  icon: '/envelope-regular.svg',
};

export const Colored = Template.bind({});
Colored.args = {
  ...defaultState,
  fill: 'lightblue',
};

export const Selected = Template.bind({});
Selected.args = {
  ...defaultState,
  isActive: true,
};
