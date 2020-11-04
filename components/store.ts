// components/store.ts

import { produce } from 'immer';
import { WritableDraft } from 'immer/dist/internal';
import create from 'zustand';
import {
  Action,
  ActionTypes,
  Current,
  CursorValues,
  HoverItem,
  IDragNodeEndPayload,
  IOpenTextEditBoxPayload,
  Side,
  State,
} from './Node/types';

let defaultState: State = {
  current: Current.Idle,
  data: {
    id: null,
    cursor: CursorValues.Default,
    text: null,
    nodePosition: null,
    arrowOrigin: null,
    arrowDest: null,
    width: null,
    hoverItem: null,
  },
  nodes: [
    {
      id: '1',
      left: 10,
      top: 10,
      width: 200,
      height: 150,
      caption: 'Webinar',
      icon: '/envelope-regular.svg',
      connectingLines: [
        {
          destinationId: '2',
          side: Side.Left,
        },
      ],
    },
    {
      id: '2',
      left: 300,
      top: 500,
      width: 200,
      height: 150,
      caption: 'Content',
      connectingLines: [
        // {
        //   destinationId: '1',
        //   side: Side.Left,
        // },
      ],
    },
  ],
  dispatch: () => null,
};

const editCaption = (
  draft: WritableDraft<State>,
  { text }: { text: string }
) => {
  draft.current = Current.Edit;
  draft.data.text = text;
};

const openTextBox = (
  draft: WritableDraft<State>,
  payload: IOpenTextEditBoxPayload
) => {
  draft.current = Current.Edit;
  draft.data = {
    ...payload,
    cursor: CursorValues.Default,
    hoverItem: null,
  };
};

const dragNodeStart = (
  draft: WritableDraft<State>,
  payload: { id: string }
) => {
  let index = draft.nodes.findIndex((node) => node.id === payload.id);
  let item = draft.nodes[index];

  draft.current = Current.Drag;
  draft.data.cursor = CursorValues.Move;
  draft.nodes.splice(index, 1);
  draft.nodes.push(item);
};

const dragNodeEnd = (
  draft: WritableDraft<State>,
  payload: IDragNodeEndPayload
) => {
  let index = draft.nodes.findIndex((node) => node.id === payload.id);

  draft.current = Current.Hover;
  draft.data = defaultState.data;
  draft.nodes[index].left = payload.x;
  draft.nodes[index].top = payload.y;
};

let reducer = (state: State, action: Action) => {
  // console.log(state.current, action.type);
  return produce(state, (draft) => {
    switch (state.current) {
      case Current.Idle:
        switch (action.type) {
          case ActionTypes.HoverText:
            draft.current = Current.Hover;
            draft.data.cursor = CursorValues.Text;
            break;
          case ActionTypes.DragNodeStart:
            dragNodeStart(draft, action.payload);
            break;
          case ActionTypes.SelectNode:
            draft.current = Current.Select;
            draft.data.id = action.payload.id;
            break;
          case ActionTypes.HoverNodeEnter:
            draft.current = Current.Hover;
            draft.data.hoverItem = HoverItem.Node;
            draft.data.cursor = CursorValues.Move;
            break;
        }
      case Current.Edit:
        switch (action.type) {
          case ActionTypes.EditCaption:
            editCaption(draft, action.payload);
            break;
          case ActionTypes.FinishEdit:
            let index = draft.nodes.findIndex(
              (node) => node.id === state.data.id
            );
            draft.nodes[index].caption = state.data.text || '';
            draft.current = Current.Idle;
            draft.data = defaultState.data;
            break;
          case ActionTypes.CancelEdit:
            draft.current = Current.Idle;
            draft.data = defaultState.data;
            break;
          case ActionTypes.ExitHover:
            console.log('Here');
            break;
          case ActionTypes.DragNodeStart:
            dragNodeStart(draft, action.payload);
            break;
        }
      case Current.Hover:
        switch (action.type) {
          case ActionTypes.OpenTextEditBox:
            openTextBox(draft, action.payload);
            break;
          case ActionTypes.ExitHover:
            draft.current = Current.Idle;
            draft.data.cursor = CursorValues.Default;
            break;
          case ActionTypes.HoverNodeExit:
            draft.current = Current.Idle;
            draft.data.hoverItem = null;
            draft.data.cursor = CursorValues.Default;
            break;
          case ActionTypes.HoverAnchorExit:
            draft.current = Current.Idle;
            draft.data.hoverItem = null;
            draft.data.cursor = CursorValues.Default;
            break;
          case ActionTypes.DragNodeStart:
            dragNodeStart(draft, action.payload);
            break;
          case ActionTypes.HoverAnchorEnter:
            draft.current = Current.Hover;
            draft.data.hoverItem = action.payload.anchorItem;
            draft.data.id = action.payload.id;
            draft.data.cursor = CursorValues.Grab;
            break;
          case ActionTypes.CreateArrowStart:
            draft.current = Current.Connect;
            break;
        }
      case Current.Drag:
        switch (action.type) {
          case ActionTypes.DragNodeEnd:
            dragNodeEnd(draft, action.payload);
            break;
        }
      case Current.Connect:
        switch (action.type) {
          case ActionTypes.CreateArrowEnd:
            draft.current = Current.Idle;
            draft.data.hoverItem = null;
        }

      case Current.Select:
        switch (action.type) {
          case ActionTypes.DragNodeStart:
            dragNodeStart(draft, action.payload);
            break;
          case ActionTypes.SelectNode:
            draft.current = Current.Select;
            draft.data.id = action.payload.id;
            break;
          case ActionTypes.OpenTextEditBox:
            openTextBox(draft, action.payload);
            break;
        }
    }
  });
};

export const useStore = create<State>((set) => ({
  ...defaultState,
  dispatch: (args) => {
    set((state) => reducer(state, args));
  },
}));
