const fs = require('fs');
const path = require('path');

assetBuilders = {
  eightballs: require('./buildassets/buildeightballs')
};

function createImages(buffers, index = 0) {
  return new Promise((resolve, reject) => {
    if (index === buffers.length - 1) {
      resolve();
    } else {
      fs.writeFileSync(path.join(__dirname, '../src/commands/assets/eightball/', `${index}.png`), buffers[index])
      createImages(buffers, index + 1).then(() => {
        resolve();
      });
    }
  });
}

function build() {
  return new Promise((resolve, reject) => {
    assetBuilders.eightballs().then((buffers) => {
      createImages(buffers).then(() => {
        resolve();
      });
    });
  });
}

build().then(() => {
  console.log('Assets built!');
});

module.exports = build;
