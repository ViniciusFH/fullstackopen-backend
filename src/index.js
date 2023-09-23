require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const PersonService = require("./services/person");

const app = express();
const PORT = process.env.PORT;

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(cors());
app.use(express.static("dist"));

const errorHandler = (error, _req, res, next) => {
  console.error(error);
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

const unknownEndpoint = (_req, res) => {
  res.status(404).json({ error: "unknown endpoint" });
};

app.get("/api/persons", (_req, res, next) => {
  PersonService.getAll()
    .then((persons) => res.json(persons))
    .catch((error) => next(error));
});

app.get("/info", (_req, res, next) => {
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

app.get("/api/persons/:id", (req, res, next) => {
  const { id } = req.params;

  PersonService.getById(id)
    .then((person) => {
      if (person) res.json(person);
      else res.sendStatus(404);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const { id } = req.params;

  PersonService.deleteById(id)
    .then(() => res.sendStatus(204))
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const person = req.body;

  if (!person || !person.name || !person.number) {
    res.status(400).json({ error: "missing person info" });
    return;
  }

  PersonService.getByName(person.name)
    .then((existingPersons) => {
      if (existingPersons.length) {
        res.status(400).json({ error: "name must be unique" });
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

app.put("/api/persons/:id", (req, res, next) => {
  const person = req.body;

  if (!person || (!person.name && !person.number)) {
    res.status(400).json({ error: "missing person info" });
    return;
  }

  PersonService.updateById(req.params.id, person)
    .then((updatedPerson) => {
      if (!updatedPerson) {
        return res.status(404).json({ message: "person not found" });
      }
      res.status(200).json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
