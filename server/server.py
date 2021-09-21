import time
from flask import Flask, session, request
from flask_socketio import SocketIO, emit, send

BOARD_DIMENSIONS = 19

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")
app.debug = True
app.host = 'localhost'


@socketio.event
def my_event(message):
    session['receive_count'] = session.get('receive_count', 0) + 1
    emit('my_response',
         {'data': message['data'], 'count': session['receive_count']})


@socketio.on("message")
def handleMessage(msg):
    print(msg)
    send(msg, broadcast=True)
    return None


connections = []
player1 = ""
player2 = ""
boardSize = 19
board = []
player = 1


@socketio.on("connect")
def handleConnections():
    global player1
    global player2
    if (len(player1) == 0):
        player1 = request.sid
    elif (len(player2) == 0):
        player2 = request.sid

    # send(clientCount, broadcast=True)
    emit("connected", {
         'player1': player1, 'player2': player2}, broadcast=True)
    if (len(player1) == 0 or len(player2) == 0):
        makeCleanBoard()


def makeCleanBoard():
    global board
    localBoard = []
    for r in range(0, 19):
        localBoard.append([])
        for c in range(0, 19):
            localBoard[r].append(0)
    board = localBoard


@socketio.on("update_board")
def updateBoard(data):
    r = data['row']
    c = data['col']
    if (board[r][c] != 0):
        emit("invalid_move")
    else:
        handleValidMove(r, c)


def handleValidMove(r, c):
    global player
    global player1
    global player2
    global board
    global connections
    board[r][c] = player
    if (checkWin(r, c, board)):
        player = 1
        makeCleanBoard()
        player1 = ""
        player2 = ""
        connections = 0
        emit("winning_move", player, broadcast=True)
    else:
        if (player == 2):
            player = 1
        else:
            player = 2
        emit("updated_board", {'board': board,
             'player': player}, broadcast=True)


def checkWin(r, c, board):
    global BOARD_DIMENSIONS
    global player
    # First grouping
    row = r
    col = c
    count = -1
    while (row >= 0 and col <= BOARD_DIMENSIONS and board[row][col] == player):
        count += 1
        row -= 1
        col += 1
    if (count >= 5):
        return True

    row = r
    col = c
    while (col >= 0 and row <= BOARD_DIMENSIONS and board[row][col] == player):
        count += 1
        row += 1
        col -= 1
    if (count >= 5):
        return True

    # Second grouping
    count = -1
    row = r
    col = c
    while (col >= 0 and row >= 0 and board[row][col] == player):
        count += 1
        row -= 1
        col -= 1
    if (count >= 5):
        return True

    row = r
    col = c
    while (col <= BOARD_DIMENSIONS and row <= BOARD_DIMENSIONS and board[row][col] == player):
        count += 1
        row += 1
        col += 1
    if (count >= 5):
        return True

    # Third grouping
    count = -1
    row = r
    col = c
    while (row >= 0 and board[row][col] == player):
        count += 1
        row -= 1
    if (count >= 5):
        return True

    row = r
    while (row <= BOARD_DIMENSIONS and board[row][col] == player):
        count += 1
        row += 1
    if (count >= 5):
        return True

    # Fourth grouping
    count = -1
    row = r
    while (col >= 0 and board[row][col] == player):
        count += 1
        col -= 1
    if (count >= 5):
        return True

    col = c
    while (col <= BOARD_DIMENSIONS and board[row][col] == player):
        count += 1
        col += 1
    if (count >= 5):
        return True
    return False


@socketio.on("disconnecting_server")
def handleConnections(playerId):
    global player1
    global player2
    print("disconnecting with " + request.sid + " " +
          player1 + " " + player2,  playerId)
    if (player1 == playerId):
        player1 = request.sid
        print("disconnecting_server", 1)
        emit("connected_after_disconnecting", {
            'player1': player1, 'player2': player2}, broadcast=True)
    elif (player2 == playerId):
        print("disconnecting_server", 2)
        player2 = request.sid
        emit("connected_after_disconnecting", {
            'player1': player1, 'player2': player2}, broadcast=True)


@socketio.on("disconnect")
def handleConnections(playerNum):
    global player1
    global player2
    if (request.sid == player1):
        player1 = ""
    elif (request.sid == player2):
        player2 = ""


if __name__ == '__main__':
    socketio.run(app)
