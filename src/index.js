'use-strict';

const Botkit = require('botkit');
const Client = require('../lib/client/client');

const slackToken = process.env.CLIENT_TOKEN;
const slackOAuth = process.env.CLIENT_OAUTH;
const slackSigningSecret = process.env.CLIENT_SIGNING_SECRET;

const slackController = Botkit.slackbot({
  require_delivery: true,
  clientSigningSecret: slackSigningSecret
});

const slackBot = slackController.spawn({
  token: slackToken
});

slackBot.startRTM((err, bot, payload) => {
  if (err) {
    throw new Error('Brian could not connect to slack!');
  } else {
    slackController.log("Slack connection established!");
  }
});

const client = new Client(slackBot, slackController, process.env.COMMAND_PREFIX);

client.loadCommands('./src/commands');
client.listenForCommands();

module.exports = client;
