let _id = 1;
const todos = []; // each: { id, text, createdAt, version }

module.exports = {
  nextId: () => _id++,
  todos,
};
