const personsRouter = require('express').Router();
const PersonService = require('../services/person');

personsRouter.get('/', (_req, res, next) => {
  PersonService.getAll()
    .then((persons) => res.json(persons))
    .catch((error) => next(error));
});

personsRouter.get('/info', (_req, res, next) => {
  PersonService.getAll()
    .then((persons) => {
      res.send(
        `<p>Phonebook has info for ${
          persons.length
        } people</p><p>${new Date()}</p>`
      );
    })
    .catch((error) => next(error));
});

personsRouter.get('/:id', (req, res, next) => {
  const { id } = req.params;

  PersonService.getById(id)
    .then((person) => {
      if (person) res.json(person);
      else res.sendStatus(404);
    })
    .catch((error) => next(error));
});

personsRouter.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  PersonService.deleteById(id)
    .then(() => res.sendStatus(204))
    .catch((error) => next(error));
});

personsRouter.post('/', (req, res, next) => {
  const person = req.body;

  PersonService.getByName(person.name)
    .then((existingPersons) => {
      if (existingPersons.length) {
        res.status(400).json({ error: 'name must be unique' });
        return;
      }

      PersonService.createNew(person)
        .then((newPerson) => {
          res.status(201).json(newPerson);
        })
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
});

personsRouter.put('/:id', (req, res, next) => {
  const person = req.body;

  PersonService.updateById(req.params.id, person)
    .then((updatedPerson) => {
      if (!updatedPerson) {
        return res.status(404).json({ error: 'person not found' });
      }
      res.status(200).json(updatedPerson);
    })
    .catch((error) => next(error));
});

module.exports = personsRouter;
