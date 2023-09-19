import { useState, useEffect } from "react";
import { Square, Arrow, MarkerColors } from "../types";

type Arrows = Arrow[];

export const useArrows = (
  customArrowColors: MarkerColors,
  customHighlightColors: MarkerColors,
  customArrows?: Arrows,
  areArrowsAllowed: boolean = true,
  onArrowsChange?: (arrows: Arrows) => void
) => {
  // arrows passed programatically to `ChessBoard` as a react prop
  const [customArrowsSet, setCustomArrows] = useState<Arrows>([]);

  // arrows drawn with mouse by user on the board
  const [arrows, setArrows] = useState<Arrows>([]);

  // active arrow which user draws while dragging mouse
  const [newArrow, setNewArrow] = useState<Arrow>();

  // handle external `customArrows` props changes
  useEffect(() => {
    if (Array.isArray(customArrows)) {
      setCustomArrows(
        //filter out arrows which starts and ends in the same square
        customArrows?.filter((arrow) => arrow.from !== arrow.to)
      );
    }
  }, [customArrows]);

  // callback when arrows changed after user interaction
  useEffect(() => {
    onArrowsChange?.(arrows);
  }, [arrows]);

  // function clears all arrows drawed by user
  function clearArrows() {
    setArrows([]);
    setNewArrow(undefined);
  }

  const drawNewArrow = (fromSquare: Square, toSquare: Square) => {
    if (!areArrowsAllowed) return;

    setNewArrow({ from: fromSquare, to: toSquare });
  };

  const allBoardArrows = [...arrows, ...customArrowsSet];

  const onArrowDrawEnd = (
    fromSquare: Square,
    toSquare: Square,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    let arrowColor: string;

    if (fromSquare === toSquare) {
      arrowColor = customHighlightColors.default;

      if (event.ctrlKey && customHighlightColors.ctrl) {
        arrowColor = customHighlightColors.ctrl;
      } else if (event.shiftKey && customHighlightColors.shift) {
        arrowColor = customHighlightColors.shift;
      } else if (event.altKey && customHighlightColors.alt) {
        arrowColor = customHighlightColors.alt;
      }
    } else {
      arrowColor = customArrowColors.default;

      if (event.ctrlKey && customArrowColors.ctrl) {
        arrowColor = customArrowColors.ctrl;
      } else if (event.shiftKey && customArrowColors.shift) {
        arrowColor = customArrowColors.shift;
      } else if (event.altKey && customArrowColors.alt) {
        arrowColor = customArrowColors.alt;
      }
    }

    let arrowsCopy;

    const newArrow: Arrow = {
      from: fromSquare,
      to: toSquare,
      color: arrowColor,
    };

    const newArrowJSON = JSON.stringify(newArrow);

    const isNewArrowUnique = allBoardArrows.every((arrow) => {
      return newArrowJSON !== JSON.stringify(arrow);
    });

    // add the newArrow to arrows array if it is unique
    if (isNewArrowUnique) {
      arrowsCopy = [...arrows, newArrow];
    }
    // remove it from the board if we already have same arrow in arrows array
    else {
      arrowsCopy = arrows.filter((arrow) => {
        return newArrowJSON !== JSON.stringify(arrow);
      });
    }

    setNewArrow(undefined);
    setArrows(arrowsCopy);
  };

  return {
    arrows: allBoardArrows,
    newArrow,
    clearArrows,
    drawNewArrow,
    setArrows,
    onArrowDrawEnd,
  };
};
