'use-strict';

const Command = require('../../lib/commands/command.js');

class Janken extends Command {
  constructor(client) {
    let options = {
      name: "janken",
      description: "Challenge me, the undefeated champion of rock-paper-scissors.",
      format: "janken"
    }
    super(client, options);
  }

  async run(message, usingPrefix) {
    let client = this.client;
    let user = message.incoming.user;

    const msgText = message.incoming.text;
    let argOffset = (usingPrefix ? client.commandPrefix.length : 0) + this.name.length;
    const argStr = message.incoming.text.substring(argOffset + 1, msgText.length).trim()

    const move = argStr.toLowerCase();

    if (move === "r" || move === "rock") {
      message.say("Paper. I win!");
    } else if (move === "s" || move === "scissors") {
      message.say("Rock. I win!");
    } else if (move === "p" || move === "paper") {
      message.say("Scissors. I win!");
    } else if (!move.length) {
      message.say("Who dares contest my superiority as a Drexel University professor? Play rock, paper, or scissors and hope for luck to come out on your side.\n\n\t_Example: " + (usingPrefix ? client.commandPrefix : '') + this.name + " rock_");
    } else {
      message.say("What kind of sorcery is this? You must play rock, paper, or scissors.\n\n\t_Example: " + (usingPrefix ? client.commandPrefix : '') + this.name + " rock_");
    }
  }
}
module.exports = Janken;
