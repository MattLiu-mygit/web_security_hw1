import React from "react";
import { toast } from "react-toastify";

const SQUARE_DIMENSIONS = 1.9;

type SquarePropType = {
  x: number;
  y: number;
  boardState: Array<Array<Number>>;
  setBoardState: Function;
  player: number;
  setPlayer: Function;
  resetGame: Function;
  socket: any;
  playerSlot: number;
};

const Square = (props: SquarePropType) => {
  const handleClick = () => {
    if (props.player === props.playerSlot) {
      props.socket.emit("update_board", { row: props.x, col: props.y });
    } else {
      toast.error("Not your turn!");
    }
  };
  return (
    <>
      <button
        onClick={handleClick}
        style={{
          border: "solid",
          borderWidth: "0.01rem",
          width: `${SQUARE_DIMENSIONS}rem`,
          height: `${SQUARE_DIMENSIONS}rem`,
          display: "flex",
          alignItems: "center",
        }}
      >
        {props.boardState[props.x][props.y] > 0 ? (
          <div
            style={{
              borderRadius: "50%",
              border: "solid",
              borderWidth: "0.05rem",
              backgroundColor:
                props.boardState[props.x][props.y] === 1 ? "black" : "white",
              height: "1rem",
              width: "1rem",
            }}
          ></div>
        ) : null}
      </button>
    </>
  );
};

export default Square;
