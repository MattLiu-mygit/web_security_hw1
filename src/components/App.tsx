import { useEffect, useState } from "react";
import Square from "./Square";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";
let endpoint = "http://localhost:5000";
let socket: any = io(`${endpoint}`);

export const BOARD_DIMENSIONS = 19;

function App() {
  const [board, setBoard] = useState<Array<Array<any>>>([]);
  const [boardState, setBoardState] = useState<Array<Array<Number>>>([]);
  const [setupMode, setSetupMode] = useState<Number>(0);
  const [player, setPlayer] = useState<number>(1);
  const [ready, setReady] = useState<boolean>(false);
  const [connections, setConnections] = useState<number>(0);
  const [playerSlot, setPlayerSlot] = useState<number>(0);

  useEffect((): any => {
    socket.on("connected", (data: any) => {
      const id = socket.id;
      if (data.player1 === id) {
        setPlayerSlot(1);
      } else if (data.player2 === id) {
        setPlayerSlot(2);
      }
      if (window.performance && performance.navigation.type === 1) {
        socket.emit("disconnecting_server", id);
      }
      if (data.player1.length > 0 && data.player1.length > 0) setConnections(2);
    });
    socket.on("updated_board", (data: any) => {
      setBoardState(data.board);
      setPlayer(data.player);
      toast.dismiss();
      toast(
        `${
          (player === 2 ? "Black's" : "White's") +
          (player !== playerSlot ? "(You)" : "(Them)")
        }'s turn!`,
        {
          position: "top-right",
          autoClose: false,
          closeOnClick: false,
          progress: undefined,
        }
      );
    });
    socket.on("winning_move", (player: number) => {
      toast.dismiss();
      toast.success((player === 1 ? "Black" : "White") + " has won!");
      resetGame();
      setSetupMode(2);
    });
    socket.on("invalid_move", () => {
      toast.error("Invalid move!");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerSlot, player]);

  useEffect(() => {
    if (connections >= 2) {
      setReady(true);
    } else {
      setReady(false);
    }
  }, [connections]);

  // Board Update
  useEffect(() => {
    if (boardState.length === BOARD_DIMENSIONS && playerSlot > 0) {
      const boardArr: Array<Array<any>> = [];
      for (let x = 0; x < BOARD_DIMENSIONS; x++) {
        const bRow: Array<any> = [];
        for (let y = 0; y < BOARD_DIMENSIONS; y++) {
          bRow.push(
            <div key={`${y + "," + x}`}>
              <Square
                x={x}
                y={y}
                boardState={boardState}
                setBoardState={setBoardState}
                player={player}
                setPlayer={setPlayer}
                resetGame={resetGame}
                socket={socket}
                playerSlot={playerSlot}
              />
            </div>
          );
        }
        boardArr.push(bRow);
      }
      setBoard(boardArr);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardState, playerSlot, player]);

  //Board State Setup
  useEffect(() => {
    if (setupMode === 0 && playerSlot > 0) {
      const boardStateArr: Array<Array<Number>> = [];
      for (let x = 0; x < BOARD_DIMENSIONS; x++) {
        const bSRow: Array<Number> = [];
        for (let y = 0; y < BOARD_DIMENSIONS; y++) {
          bSRow.push(0);
        }
        boardStateArr.push(bSRow);
      }
      toast.dismiss();
      toast(
        `${
          (player === 1 ? "Black's" : "White's") +
          (player === playerSlot ? "(You)" : "(Them)")
        } turn!`,
        {
          position: "top-right",
          autoClose: false,
          closeOnClick: false,
          progress: undefined,
        }
      );
      setBoardState(boardStateArr);
      setSetupMode(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardState, playerSlot, player]);

  const resetGame = () => {
    setBoard([]);
    setBoardState([]);
    setSetupMode(2);
    setPlayer(1);
  };

  return (
    <>
      <div
        className="App"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1>5-In-A-Row!</h1>
        {!ready ? (
          <h3>Only 1 connection. Please wait for Player 2.</h3>
        ) : setupMode === 2 ? (
          <h3>
            {player === 1 ? "Black" : "White"}
            {player !== playerSlot ? "(You) " : "(Them) "}has won! Please
            restart the server to play again.
          </h3>
        ) : (
          <div style={{ margin: "auto", paddingBottom: "4rem" }}>
            {board.map((row: Array<any>, index) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
                key={index + "row"}
              >
                {row}
              </div>
            ))}
          </div>
        )}
      </div>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
