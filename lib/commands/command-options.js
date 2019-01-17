'use-strict';

// Command options class.

/*
Properties:
  options - Object - An object with the desired properties for the command.
  | name - String - The name of the command. Used after the command prefix to pick the command.
  | descritpion - String - The description of the command. Used in the help command.
  | format - String - The format for using the command.
  | examples - [String] - Optional - An array of examples for command usage.
 */
class CommandOptions {
  constructor(options = {}) {
    if (options.client) {
      this.client = options.client;
    } else {
      throw new Error('CommandOptions needs to be passed a client!');
    }

    if (options.name && options.description && options.format) {
      let client = this.client;
      this.name = options.name;
      this.description = options.description;
      this.format = `${client.commandPrefix}${options.format}`;
    } else {
      // Find the first missing argument and error based on one that's missing.
      let missingComponent = "";
      missingComponent = options.name ? "" : "name";
      missingComponent = options.description ? "" : "description";
      missingComponent = optins.format ? "" : "format";

      throw new Error(`CommandOptions must have a ${missingComponent}!`);
    }

    this.examples = options.examples || [];
    this.examples = options.exampls.map(example => `${client.commandPrefix}${example}`);
  }
}
module.exports = CommandOptions;
