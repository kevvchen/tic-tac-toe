function Gameboard() {
  const ROWS = 3;
  const COLS = 3;
  const board = [];

  for (let i = 0; i < ROWS; i++) {
    board[i] = [];
    for (let j = 0; j < COLS; j++) {
      board[i].push(Cell());
    }
  }

  const markSpot = (row, col, tokenVal) => {
    const rowInvalid = row < 0 || row >= ROWS;
    const colInvalid = col < 0 || col >= COLS;

    // Check if the passed in coordinates are valid
    if (rowInvalid || colInvalid || board[row][col].getValue() !== "") return;

    // Can go ahead and mark the cell
    board[row][col].markCell(tokenVal);
  };

  // Print our board to the console to see what board looks like after every round of play
  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };

  const checkWin = () => {
    // Check if theres a winning condition based on rows
    for (let i = 0; i < ROWS; i++) {
      if (
        board[i][0].getValue() !== "" &&
        board[i][0].getValue() === board[i][1].getValue() &&
        board[i][1].getValue() === board[i][2].getValue()
      ) {
        return true;
      }
    }
    // Check if theres a winning condition based on columns
    for (let j = 0; j < COLS; j++) {
      if (
        board[0][j].getValue() !== "" &&
        board[0][j].getValue() === board[1][j].getValue() &&
        board[1][j].getValue() === board[2][j].getValue()
      ) {
        return true;
      }
    }

    // Check main diagonal
    // We set it up this way because formatting error
    // (board[0][0].getValue() === board[1][1].getValue()) === board[2][2].getValue()
    const mainDiagonalA = board[0][0].getValue();
    const sharedDiagonal = board[1][1].getValue();
    const mainDiagonalC = board[2][2].getValue();

    if (
      mainDiagonalA !== "" &&
      mainDiagonalA === sharedDiagonal &&
      sharedDiagonal === mainDiagonalC
    )
      return true;

    // Check anti diagonal
    const antiDiagonalA = board[0][2].getValue();
    const antiDiagonalC = board[2][0].getValue();

    if (
      antiDiagonalA !== "" &&
      antiDiagonalA === sharedDiagonal &&
      sharedDiagonal === antiDiagonalC
    )
      return true;
  };

  const checkTie = () => {
    return board.every((row) => row.every((cell) => cell.getValue() !== ""));
  };

  return { markSpot, checkWin, checkTie, printBoard };
}

/*
The Player function allows us to create players for our tic-tac-toe game
Each Player will have a token, so we know what their 'mark' is for the board
*/
function Player() {
  const createPlayer = (playerName, playerToken) => ({
    playerName,
    playerToken,
  });

  return { createPlayer };
}

/*
A cell represents one "square" on the board and can have one of:
'' (empty): Square is unmarked and up for grabs
X: Square is marked by Player1
O: Square is marked by Player2
*/
function Cell() {
  let value = "";

  // Accept's a players token to change the value of the cell
  const markCell = (playerToken) => {
    value = playerToken;
  };

  // Get the current value of the cell using closure
  const getValue = () => value;

  return { markCell, getValue };
}

/*
Execute the game 
*/
function GameController() {
  const board = Gameboard(); // Calling the Gameboard factory function. Now we have access to the objects it returns
  const player = Player();
  const player1 = player.createPlayer("Kevin", "X");
  const player2 = player.createPlayer("Polar", "O");

  const players = [];
  players.push(player1, player2);

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().playerName}'s turn.`);
  };

  const playRound = (row, col) => {
    // Mark a cell for the current players turn
    console.log(
      `Player named ${
        getActivePlayer().playerName
      } marked the cell at location (${row}, ${col})`
    );

    // Allow the current activePlayer to mark a spot
    board.markSpot(row, col, getActivePlayer().playerToken);

    // Check for winning condition
    if (board.checkWin()) {
      board.printBoard()
      console.log(`${getActivePlayer().playerName} has won the game`);
      return;
    }

    // Check for tie condition
    if (board.checkTie()) {
      board.printBoard()
      console.log("No players have won. The game resulted in a tie");
      return;
    }

    // Switch player turn
    switchPlayerTurn();
    printNewRound();
  };

  // Initial game message
  printNewRound();

  return { playRound };
}

const game = GameController();
game.playRound(0,0); // X
game.playRound(0,1); // O
game.playRound(0,2); // X
game.playRound(1,1); // O
game.playRound(1,0); // X
game.playRound(1,2); // O
game.playRound(2,1); // X
game.playRound(2,0); // O
game.playRound(2,2); // X
