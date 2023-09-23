const Person = require("../models/person");

function getAll() {
  return Person.find({});
}

function getById(id) {
  return Person.findById(id);
}

function deleteById(id) {
  return Person.findByIdAndDelete(id);
}

function getByName(name) {
  return Person.find({ name });
}

async function createNew(person) {
  const newPerson = new Person(person);

  await newPerson.save();

  return newPerson;
}

async function updateById(id, data) {
  const updatedPerson = await Person.findByIdAndUpdate(id, data, { new: true });

  return updatedPerson;
}

module.exports = {
  getAll,
  getById,
  deleteById,
  getByName,
  createNew,
  updateById,
};
