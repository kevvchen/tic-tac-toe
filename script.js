function Gameboard() {
  const rows = 3;
  const cols = 3;

  const board = Array.from({ length: rows }, () =>
    new Array(cols).fill(Cell())
  );

  return { board };
}

/*
The Player function allows us to create players for our tic-tac-toe game
Each Player will have a token, so we know what their 'mark' is for the board
*/
function Player(playerName, playerToken) {
  return { playerName, playerToken };
}

/*
A cell represents one "square" on the board and can have one of:
0: Square is unmarked and up for grabs
1: Square is marked by Player1
2: Square is marked by Player2
*/
function Cell() {
  let value = 0;

  // Accept's a players token to change the value of the cell
  const markCell = (playerToken) => {
    value = playerToken;
  };

  // Get the current value of the cell using closure
  const getValue = () => value;

  return { markCell, getValue };
}

function GameController() {
  
}
