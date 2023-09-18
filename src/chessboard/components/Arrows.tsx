import { Fragment } from "react";

import { getRelativeCoords } from "../functions";
import { useChessboard } from "../context/chessboard-context";
import { Arrow } from "../types";

export const Arrows = () => {
  const {
    arrows,
    newArrow,
    boardOrientation,
    boardWidth,

    customArrowColor: primaryArrowCollor,
  } = useChessboard();
  const arrowsList = [...arrows, newArrow].filter(Boolean) as Arrow[];

  return (
    <svg
      width={boardWidth}
      height={boardWidth}
      style={{
        position: "absolute",
        top: "0",
        left: "0",
        pointerEvents: "none",
        zIndex: "10",
      }}
    >
      {arrowsList.map((arrow, i) => {
        if (arrow.from === arrow.to) return null;
        const from = getRelativeCoords(
          boardOrientation,
          boardWidth,
          arrow.from
        );
        const to = getRelativeCoords(boardOrientation, boardWidth, arrow.to);
        let ARROW_LENGTH_REDUCER = boardWidth / 32;

        const isArrowActive = i === arrows.length;
        // if there are different arrows targeting the same square make their length a bit shorter
        if (
          arrows.some(
            (restArrow) =>
              restArrow.from !== arrow.from && restArrow.to === arrow.to
          ) &&
          !isArrowActive
        ) {
          ARROW_LENGTH_REDUCER = boardWidth / 16;
        }
        const dx = to.x - from.x;
        const dy = to.y - from.y;

        const r = Math.hypot(dy, dx);

        const end = {
          x: from.x + (dx * (r - ARROW_LENGTH_REDUCER)) / r,
          y: from.y + (dy * (r - ARROW_LENGTH_REDUCER)) / r,
        };

        return (
          <Fragment
            key={`${JSON.stringify(arrow)}-${i}${
              isArrowActive ? "-active" : ""
            }`}
          >
            <marker
              id={`arrowhead-${i}`}
              markerWidth="2"
              markerHeight="2.5"
              refX="1.25"
              refY="1.25"
              orient="auto"
            >
              <polygon
                points="0.3 0, 2 1.25, 0.3 2.5"
                fill={arrow.color ?? primaryArrowCollor}
              />
            </marker>
            <line
              x1={from.x}
              y1={from.y}
              x2={end.x}
              y2={end.y}
              opacity={arrow.opacity ?? (isArrowActive ? "0.5" : "0.65")}
              stroke={arrow.color ?? primaryArrowCollor}
              strokeWidth={
                arrow.width ??
                (isArrowActive ? (0.9 * boardWidth) / 40 : boardWidth / 40)
              }
              markerEnd={`url(#arrowhead-${i})`}
            />
            {arrow.text ? (
              <text
                x={(from.x + end.x) / 2}
                y={(from.y + end.y) / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={arrow.textColor ?? "black"}
                fontSize={arrow.fontSize}
                fontWeight={arrow.fontWeight}
                fontFamily={arrow.fontFamily}
              >
                {arrow.text}
              </text>
            ) : null}
          </Fragment>
        );
      })}
    </svg>
  );
};
