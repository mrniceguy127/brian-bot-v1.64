'use-strict';

const Canvas = require("canvas");

async function getOverlayedImage(baseImageURL, overlayImageURL, dimensions, overlayPlacement) {
  const canvas = Canvas.createCanvas(dimensions.w, dimensions.h),
  ctx = canvas.getContext('2d');

  let baseImage = null,
      overlayImage = null,
      buffer = null,
      possibleErr = null;

  try {
    baseImage = await Canvas.loadImage(baseImageURL);
    overlayImage = await Canvas.loadImage(overlayImageURL);
  } catch (err) {
    possibleErr = err;
  }

  return new Promise((resolve, reject) => {
    if (!possibleErr) {
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(overlayImage, overlayPlacement.x, overlayPlacement.y, overlayPlacement.w, overlayPlacement.h);

      let stream = canvas.toBuffer();
      resolve(stream);
    } else {
      console.log(possibleErr.stack);
      reject(possibleErr);
    }
  });
}

module.exports = {
  getOverlayedImage: getOverlayedImage
}
