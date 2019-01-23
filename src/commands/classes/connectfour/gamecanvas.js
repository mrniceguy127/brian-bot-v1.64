const Canvas = require('canvas');

class GameCanvas {
  constructor(game, assets) {
    this.game = game;
    this.assets = assets;
  }

  async getBoardImageBuffer() {
    const canvas = Canvas.createCanvas(700, 600);
    const ctx = canvas.getContext('2d');

    // Since the image takes time to load, you should await it
    const background = await Canvas.loadImage(this.assets.scene);

    // This uses the canvas dimensions to stretch the image onto the entire canvas
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    const boardTile = await Canvas.loadImage(this.assets.boardTile);

    let xCenterOffset = (canvas.width - (7 * boardTile.width)) / 2,
    yCenterOffset = (canvas.height - (6 * boardTile.height)) / 2;

    let x, y;

    for (x = 0; x < 7; x++) {
      for (y = 0; y < 6; y++) {
        if (this.game.board.state[x][y] === 1) {
          ctx.fillStyle = '#FF0000';
          ctx.fillRect((x*70)+xCenterOffset, (y*60)+yCenterOffset, 70, 60);
          ctx.fillStyle = '#000000';
        } else if (this.game.board.state[x][y] === 2) {
          ctx.fillRect((x*70)+xCenterOffset, (y*60)+yCenterOffset, 70, 60);
        }
        ctx.drawImage(boardTile, (x*70)+xCenterOffset, (y*60)+yCenterOffset, 70, 60);
      }
      ctx.fillStyle = "white";
      ctx.font = "30px Arial";
      ctx.fillText(x+1, ((x)*70)+xCenterOffset+((boardTile.width/2)-10), ((y+1)*60)+yCenterOffset);
    }

    // Use helpful Attachment class structure to process the file for you
    let buffer = canvas.toBuffer();

    return new Promise((resolve, reject) => {
      resolve(buffer);
    });
  }
};

module.exports = GameCanvas;
