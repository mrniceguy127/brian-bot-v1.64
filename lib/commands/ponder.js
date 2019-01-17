const Command = require('./command.js');

class Ponder extends Command {
  constructor(client) {
    let options = {
      name: "ponder",
      description: "Enables Brian L. Stuart to opine about various subjects of interest to Him.",
      format: "bls.ponder"
    };
    super(client, options);

    this.thoughts = [
      "Floating-point is evil.",
      "JS frameworks are unnecessary.",
      "Coding in binary is superior.",
      "I should wear festive Christmas headgear.",
      "Exams are fun."
    ];
  }

  run(message)
  {
    let i = Math.floor(Math.random() * this.thoughts.length);

    let thought = this.thoughts[i];

    this.client.startConversation(message, (error, conversation) => {
      conversation.say(thought);
    });
  }
}
module.exports = Ponder;
