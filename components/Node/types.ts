export enum Side {
  Top,
  Left,
  Bottom,
  Right,
}

export type connectingLine = {
  destinationId: string;
  side: Side;
};

type node = {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  icon?: string;
  caption: string;
  connectingLines: connectingLine[];
};

export enum Current {
  Idle = 'Idle',
  Hover = 'Hover',
  Select = 'Select',
  Drag = 'Drag',
  Edit = 'Edit',
  Connect = 'Connect',
}

export enum ActionTypes {
  HoverNodeEnter = 'HoverNodeEnter',
  HoverNodeExit = 'HoverNodeExit',
  HoverAnchorEnter = 'HoverAnchorEnter',
  HoverAnchorExit = 'HoverAnchorExit',
  CreateArrowStart = 'CreateArrowStart',
  CreateArrowEnd = 'CreateArrowEnd',
  DragNodeStart = 'DragNodeStart',
  DragNodeEnd = 'DragNodeEnd',
  SelectNode = 'SelectNode',
  OpenTextEditBox = 'OpenTextEditBox',
  EditCaption = 'EditCaption',
  FinishEdit = 'FinishEdit',
  HoverText = 'HoverText',
  ExitHover = 'ExitHover',
  CancelEdit = 'CancelEdit',
}

export enum CursorValues {
  Default = 'default',
  Move = 'move',
  Text = 'text',
  Grab = 'grab',
}

export enum HoverItem {
  Node,
  AnchorLeft,
  AnchorRight,
  AnchorUp,
  AnchorDown,
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

export interface Position {
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
    }
  | {
      type: ActionTypes.HoverNodeEnter;
    }
  | {
      type: ActionTypes.HoverNodeExit;
    }
  | {
      type: ActionTypes.HoverAnchorEnter;
      payload: {
        anchorItem:
          | HoverItem.AnchorUp
          | HoverItem.AnchorDown
          | HoverItem.AnchorLeft
          | HoverItem.AnchorRight;
        id: string;
      };
    }
  | {
      type: ActionTypes.HoverAnchorExit;
    }
  | {
      type: ActionTypes.CreateArrowStart;
      payload: {
        x: number;
        y: number;
      };
    }
  | {
      type: ActionTypes.CreateArrowEnd;
    };

export type State = {
  current: Current;
  data: {
    id: string | null;
    cursor: CursorValues;
    text: string | null;
    nodePosition: Position | null;
    arrowOrigin: Position | null;
    arrowDest: Position | null;
    width: number | null;
    hoverItem: HoverItem | null;
  };
  nodes: node[];
  dispatch: (arg0: Action) => void;
};
