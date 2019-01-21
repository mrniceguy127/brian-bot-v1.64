'use-strict';

const Canvas = require("canvas");

// overlays = [
// { imageURL: 'image1.png', x: 25, y: 25, w: 100, h: 100 },
// { imageURL: 'image2.png', x: 125, y: 25, w: 100, h: 100 }
// ]
async function getOverlayedImage(baseImageURL, dimensions, overlays) {
  const canvas = Canvas.createCanvas(dimensions.w, dimensions.h),
  ctx = canvas.getContext('2d');

  let baseImage = null,
      overlayImages = [],
      buffer = null,
      possibleErr = null;

  try {
    baseImage = await Canvas.loadImage(baseImageURL);
    for (var i = 0; i < overlays.length; i++) {
      overlayImages[i] = await Canvas.loadImage(overlays[i].imageURL);
    }
  } catch (err) {
    possibleErr = err;
  }

  return new Promise((resolve, reject) => {
    if (!possibleErr) {
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      for (var i = 0; i < overlayImages.length; i++) {
        let overlay = overlays[i];
        ctx.drawImage(overlayImages[i], overlay.x, overlay.y, overlay.w, overlay.h);
      }

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
