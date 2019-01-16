'use-strict';
const dotenv = require('dotenv');

dotenv.config();

const Botkit = require('botkit');

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

slackController.hears(["mantissa"], ["ambient"], (bot, message) => {
  bot.startConversation(message, (err, conversation) => {
    conversation.say("BEWARE!");
  });
});
