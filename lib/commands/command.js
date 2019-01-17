// Abstract command class.

class Command {
  constructor(client, options = {}) {
    this.client = client;
    let commandOptions = new CommandOptions(options);
  }

  run() {
    /* nothing. abstract function. */
  }
}
