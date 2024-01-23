const { randomUUID } = require('node:crypto');

class PDF {
  id;

  content;

  backgroundImageURL;

  constructor({ content, backgroundImageURL }) {
    this.id = randomUUID();
    this.content = content;
    this.backgroundImageURL = backgroundImageURL;
  }
}

module.exports = { PDF };
