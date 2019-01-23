class Message {
  constructor(client, incoming) {
    this.client = client;
    this.incoming = incoming;
  }

  // Reply to a message based on the incoming message, and where replyMessage
  // is a string or a message object
  say(messageText) {
    return new Promise((resolve, reject) => { // Resolve if message was successfully sent, reject otherwise
      this.client.slackBot.startConversation(this.incoming, (err, conversation) => {
        if (err) {
          reject(err);
        } else {
          conversation.say(messageText);
          resolve(conversation); // Resolve with conversation
        }
      });
    });
  }
};

module.exports = Message;
