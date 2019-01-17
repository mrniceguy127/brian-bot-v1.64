'use-strict';

const Command = require('../../lib/commands/command.js');

class Ponder extends Command {
  constructor(client) {
    let options = {
      name: "ponder",
      description: "Enables Brian L. Stuart to opine about various subjects of interest to Him.",
      format: "bls.ponder"
    };
    super(client, options);
  }

  async run(message)
  {
    let client = this.client;

    let thoughts = [ // Array of Brian's opinions.
      "Floating-point is evil.",
      "JS frameworks are unnecessary.",
      "Coding in binary is superior.",
      "I should wear festive Christmas headgear.",
      "Exams are fun.",
      "The fact that floating-point numbers cannot precisely represent all real numbers, and that floating-point operations cannot precisely represent true arithmetic operations, leads to many surprising situations."
    ];
    let i = Math.floor(Math.random() * thoughts.length);

    let thought = thoughts[i];

    client.say(message, thought);
  }
}
module.exports = Ponder;
