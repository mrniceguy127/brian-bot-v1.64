'use-strict';

// Returns an array of all of the command classes based on the given path

const path = require('path');

module.exports = (commandsPath) => {
  let commandClasses = [];

  let commandsPathResolved = path.resolve(commandsPath); // Resolves to absolute path

  // Require index of command path to retrieve command list
  let commandsList = require(commandsPathResolved);

  // Iterate over the list and match the corresponding files
  commandsList.forEach((commandFileName) => {
    const commandClass = require(path.join(commandsPathResolved, commandFileName + '.js'));
    commandClasses.push(commandClass); // Push the returned class to the commandClasses array
  });

  return commandClasses;
};
