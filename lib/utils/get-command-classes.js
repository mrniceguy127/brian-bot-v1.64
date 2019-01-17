'use-strict';

const path = require('path');

module.exports = (commandsPath) => {
  let commandsPathResolved = path.resolve(commandsPath);
  let commandsList = require(commandsPathResolved);
  let commandClasses = [];
  commandsList.forEach((commandFileName) => {
    const commandClass = require(path.join(commandsPathResolved, commandFileName + '.js'));
    commandClasses.push(commandClass);
  });

  return commandClasses;
};
