'use-strict';

const Message = require('../message/message.js');

class Client {
  constructor(slackBot, slackController, commandPrefix) {
    this.slackBot = slackBot;
    this.slackController = slackController;
    this.commandPrefix = commandPrefix;

    // To be loaded with registered commands
    this.commands = new Map();
  }

  // Initializes Brian Bot v1.64
  initialize(introChannel, commandsPath, messageTypes = [ 'direct_message', 'direct_mention', 'mention', 'ambient' ])
  {
    if (introChannel)
    {
      this.introduce(introChannel);
    }
    this.loadCommands(commandsPath);
    this.listenForCommands(messageTypes);
  }

  // Introduces bot to designated Slack channel on first run
  introduce(introChannel)
  {
    let intro = '*Greetings!* My name is Brian Bot v1.64, but you can call me Professor Brian L. Stuart.\n';
    this.slackBot.say({
      text: intro,
      channel: introChannel
    });
  }

  // Loads commands and stores them in client
  loadCommands(commandsPath) {
    // Retrieve list of command classes
    const getCommandClasses = require('../utils/get-command-classes');
    let commandClasses = getCommandClasses(commandsPath);

    // Iterate over the array and store each instantiated class in a Map of commands
    commandClasses.forEach((commandClass) => {
      let command = new commandClass(this);
      this.commands.set(command.name, command); // Key (command name) => Value (command instance)
    });
  }

  // Listen to all messages of the provided message types (optional) and
  // search for any valid commands
  listenForCommands(messageTypes) {
    this.slackController.hears(".*", messageTypes, (bot, message) => {
      // For direct messages and mentions, no prefix needed
      let usingPrefix = !(message.type === 'direct_message' || message.type === 'direct_mention');

      let command = this.parseCommand(message.text, usingPrefix);
      if (command) {
        command.run(new Message(this, message), usingPrefix);
      }
    });
  }

  // Parse a given message text for a command
  parseCommand(messageText, usingPrefix) {
    let command = undefined;

    // For each possible command, test message text against a regular expression
    Array.from(this.commands.values()).forEach((testCommand) => {
      let commandFormat = (usingPrefix ? this.commandPrefix : '') + testCommand.name;

      // Find a command usage, ex: 'prefix.command' is valid at the start of the message
      // as long as there is at least one whitespace
      let commandRegExp = new RegExp(`^(${commandFormat})\\s+`);

      // Check if RegEx matched something in the message text or the message
      // equals the command call because no arguments were given
      if (messageText.search(commandRegExp) !== -1 || commandFormat === messageText.trim()) {
        command = testCommand;
      }
    });

    return command; // Return the command, or undefined if none found
  }

  // // Reply to a message based on the incoming message, and where replyMessage
  // // is a string or a message object
  // say(incomingMessage, replyMessage) {
  //   return new Promise((resolve, reject) => { // Resolve if message was successfully sent, reject otherwise
  //     this.slackBot.startConversation(incomingMessage, (err, conversation) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         conversation.say(replyMessage);
  //         resolve(conversation); // Resolve with conversation
  //       }
  //     });
  //   });
  // }

  log(message) { // Log something
    this.slackController.log(message);
  }
}

module.exports = Client;
