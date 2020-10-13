type node = {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  icon?: string;
  caption: string;
};

export enum Current {
  Idle = 'Idle',
  Hover = 'Hover',
  Select = 'Select',
  Drag = 'Drag',
  Edit = 'Edit',
}

export enum ActionTypes {
  HoverNode = 'HoverNode',
  DragNodeStart = 'DragNodeStart',
  SelectNode = 'SelectNode',
  OpenTextEditBox = 'OpenTextEditBox',
  EditCaption = 'EditCaption',
  FinishEdit = 'FinishEdit',
  HoverText = 'HoverText',
  ExitHover = 'ExitHover',
  DragNodeEnd = 'DragNodeEnd',
  CancelEdit = 'CancelEdit',
}

export enum CursorValues {
  Default = 'default',
  Move = 'move',
  Text = 'text',
}

export interface IOpenTextEditBoxPayload {
  id: string;
  x: number;
  y: number;
  text: string;
  width: number;
}

export interface IDragNodeEndPayload {
  id: string;
  x: number;
  y: number;
}

export type Action =
  | {
      type: ActionTypes.OpenTextEditBox;
      payload: IOpenTextEditBoxPayload;
    }
  | {
      type: ActionTypes.EditCaption;
      payload: {
        text: string;
      };
    }
  | {
      type: ActionTypes.FinishEdit;
    }
  | {
      type: ActionTypes.HoverText;
    }
  | {
      type: ActionTypes.ExitHover;
    }
  | {
      type: ActionTypes.DragNodeStart;
      payload: {
        id: string;
      };
    }
  | {
      type: ActionTypes.DragNodeEnd;
      payload: IDragNodeEndPayload;
    }
  | {
      type: ActionTypes.CancelEdit;
    }
  | {
      type: ActionTypes.SelectNode;
      payload: {
        id: string;
      };
    };

export type State = {
  current: Current;
  data: {
    id: string | null;
    cursor: CursorValues;
    text: string | null;
    x: number | null;
    y: number | null;
    width: number | null;
  };
  nodes: node[];
  dispatch: (arg0: Action) => void;
};
