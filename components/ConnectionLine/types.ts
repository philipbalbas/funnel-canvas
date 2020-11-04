enum Curvature {
  Straight,
  Curved,
}

enum ArrowHead {
  Straight,
  Curved,
  None,
}

export interface IConnectionLineProps {
  color: string;
  strokeWidth: number;
  curvature: Curvature;
  arrowHeadType: ArrowHead;
  canDisconnect: boolean;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
