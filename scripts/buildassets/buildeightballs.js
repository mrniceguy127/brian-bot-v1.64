const fs = require('fs');
const path = require('path');
const Canvas = require('canvas')

async function getBuffers() {
  const answers = JSON.parse(fs.readFileSync(path.join(__dirname, './buildeightballs/answers.json')));

  console.log(answers, answers.length);

  // Since the image takes time to load, you should await it
  const canvas = Canvas.createCanvas(512, 512);
  const background = await Canvas.loadImage(path.join(__dirname, 'buildeightballs/scene.png'));
  const ctx = canvas.getContext('2d');

  let buffers = [];

  let i;
  for (i = 0; i < answers.length; i++) {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText(answers[i], 211, 212, 175);
    buffers.push(canvas.toBuffer());
  }

  // Use helpful Attachment class structure to process the file for you

  return new Promise((resolve, reject) => {
    resolve(buffers);
  });
}

module.exports = getBuffers;
