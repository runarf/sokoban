import {
  TILE_SIZE,
  TILE_CENTER,
  TILE_CENTER_AFTER_MOVE,
} from "../../consts/Tiles";

interface CenterMove {
  x: number;
  y: number;
}
interface AbsoluteMove {
  x?: string;
  y?: string;
}
export interface Moves {
  absoluteMove: AbsoluteMove;
  centerMove: CenterMove;
  direction: string;
}
export const MOVE_LEFT: Moves = {
  absoluteMove: { x: "-=" + TILE_SIZE },
  centerMove: { x: -TILE_CENTER, y: TILE_CENTER },
  direction: "left",
};
export const MOVE_RIGHT: Moves = {
  absoluteMove: { x: `+=${TILE_SIZE}` },
  centerMove: { x: TILE_CENTER_AFTER_MOVE, y: TILE_CENTER },
  direction: "right",
};
export const MOVE_UP: Moves = {
  absoluteMove: { y: "-=" + TILE_SIZE },
  centerMove: { x: TILE_CENTER, y: -TILE_CENTER },
  direction: "up",
};
export const MOVE_DOWN: Moves = {
  absoluteMove: { y: "+=" + TILE_SIZE },
  centerMove: { x: TILE_CENTER, y: TILE_CENTER_AFTER_MOVE },
  direction: "down",
};
