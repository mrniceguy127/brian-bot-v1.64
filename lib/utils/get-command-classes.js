'use-strict';

// Returns and array of all of the command classes based on the given path.

const path = require('path');

module.exports = (commandsPath) => {
  let commandsPathResolved = path.resolve(commandsPath);
  let commandsList = require(commandsPathResolved); // Require the given list of commands based on commandsPath.
  let commandClasses = [];
  commandsList.forEach((commandFileName) => { // Iterate over the list and match the corresponding files.
    const commandClass = require(path.join(commandsPathResolved, commandFileName + '.js')); // Require the matched file.
    commandClasses.push(commandClass); // Push the returned array to the commandClasses array.
  });

  return commandClasses; // Return the command Classes.
};
