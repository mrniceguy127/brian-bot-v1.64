const Command = require('./command.js');

class Ponder extends Command {
  constructor(client) {
    let options = {
      name: "ponder",
      description: "Enables Brian L. Stuart to opine about various subjects of interest to Him.",
      format: "bls.ponder"
    };
    super(client, options);
  }

  // thoughts = array of Brian's opinions
  run(message, thoughts)
  {
    let i = Math.floor(Math.random() * thoughts.length);

    let thought = thoughts[i];

    this.client.startConversation(message, (error, conversation) => {
      conversation.say(thought);
    });
  }
}
module.exports = Ponder;
