'use-strict';

const Command = require('../../lib/commands/command.js');
const getRandomString = require('../../lib/utils/get-random-string.js');

class Ponder extends Command {
  constructor(client) {
    let options = {
      name: "ponder",
      description: "Enables Brian L. Stuart to opine about various subjects of interest to Him.",
      format: "ponder"
    };
    super(client, options);

    this.prevThought = -1;
  }

  async run(message, usingPrefix)
  {
    let client = this.client;

    let thoughts = [ // Array of Brian's opinions.
      "Floating-point is evil.",
      "JS frameworks are unnecessary.",
      "Coding in binary is superior.",
      "I should wear festive Christmas headgear.",
      "Exams are fun.",
      "The fact that floating-point numbers cannot precisely represent all real numbers, and that floating-point operations cannot precisely represent true arithmetic operations, leads to many surprising situations.",
      "The mantissa is incalculable.",
      "We can never hope to predict the terrifying power of the mantissa.",
      "Proprietary closed source software is not my strong suit.",
      "A book of blue books is impossible.",
      "JavaScript is a particularly difficult language.",
      "Object-oriented programming is generally overrated.",
      "I have a little whiteboard thingy.",
      "I shall have my students program virtual pets. What could go wrong?",
      "Am I a person?",
      "Artificial intelligence isn't all it's cracked up to be.",
      "Why do computer scientists so often confuse Halloween and Christmas?",
      "Global variables are nothing to be afraid of.",
      "Sometimes I dream of two's complement.",
      "Behold! The CARDIAC is a useful method of demonstrating how computers are programmed on a low level. I have devised a suitable web-based simulation for my students' benefit.",
      "You know what this midterm needs? _ゴゴ ゴ  ゴ_",
      "Fear not, CCI students. I am here!",
      "The mantissa is over 9000.",
      "C is better than C++ because you can memorize the C Standard Library."
    ];

    let strResult = getRandomString(thoughts, this.prevThought);
    this.prevThought = strResult.index;

    let thought = strResult.string;
    message.say(thought);
  }
}
module.exports = Ponder;
