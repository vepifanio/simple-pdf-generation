class InMemoryPDFsRepository {
  items;

  constructor() {
    this.items = [];
  }

  save(pdf) {
    this.items.push(pdf);
  }

  list() {
    return this.items;
  }

  getById(id) {
    return this.items.find((item) => item.id === id);
  }
}

module.exports = { InMemoryPDFsRepository };
