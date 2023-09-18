import { useState, useEffect } from "react";
import { Square, Arrow } from "../types";

type Arrows = Arrow[];

export const useArrows = (
  customArrows?: Arrows,
  areArrowsAllowed: boolean = true,
  onArrowsChange?: (arrows: Arrows) => void,
  customArrowColor?: string
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

    setNewArrow({ from: fromSquare, to: toSquare, color: customArrowColor });
  };

  const allBoardArrows = [...arrows, ...customArrowsSet];

  const onArrowDrawEnd = (fromSquare: Square, toSquare: Square) => {
    if (fromSquare === toSquare) return;

    let arrowsCopy;
    const newArrow: Arrow = {
      from: fromSquare,
      to: toSquare,
      color: customArrowColor,
    };

    const isNewArrowUnique = allBoardArrows.every((arrow) => {
      return !(arrow.from === fromSquare && arrow.to === toSquare);
    });

    // add the newArrow to arrows array if it is unique
    if (isNewArrowUnique) {
      arrowsCopy = [...arrows, newArrow];
    }
    // remove it from the board if we already have same arrow in arrows array
    else {
      arrowsCopy = arrows.filter((arrow) => {
        return !(arrow.from === fromSquare && arrow.to === toSquare);
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
