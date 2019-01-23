class Board {
  constructor() {
    this.state = [
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0]
    ]; // The board state.
  }

  // Make a move on the board based on the given player and position.
  //   pos - A number representing a position on the board.
  //   player - The player to place the piece as (1 for player 1 and 2 for player 2).
  makeMove(pos, player) {
    let piecePlaced = false;
    this.state[pos].forEach((occupant, i) => {
      if (!piecePlaced) {
        if (occupant === 1 || occupant === 2) {
          if (i > 0 && this.state[pos][i-1] === 0) {
            this.state[pos][i-1] = player;
            piecePlaced = true;
          }
        } else if (i === 5 && occupant === 0) {
          this.state[pos][i] = player;
          piecePlaced = true;
        }
      }
    });
  }
};

module.exports = Board;
