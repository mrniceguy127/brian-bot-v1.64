'use-strict';

// Abstract command class.
const CommandOptions = require('./command-options.js');

class Command {
  constructor(client, options = {}) {
    if (this.constructor === Command)
    {
      throw new Error("Can't instantiate an abstract class!");
    }
    else {
      this.client = client;

      let commandOptions = new CommandOptions(options);
      this.name = commandOptions.name;
      this.description = commandOptions.description;
      this.format = commandOptions.format;
      this.examples = commandOptions.examples;
    }
  }

  async run() {
    /* Do nothing. Abstract function. */
  }
}
module.exports = Command;
