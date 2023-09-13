const express = require("express");
const morgan = require("morgan");

const app = express();
const PORT = 3001;

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (_req, res) => {
  res.json(persons);
});

app.get("/info", (_req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
  );
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);

  if (person) res.json(person);
  else res.sendStatus(404);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id !== id);

  res.sendStatus(204);
});

app.post("/api/persons", (req, res) => {
  const { content } = req.body;

  if (!content || !content.name || !content.number) {
    res.status(400).json({ error: "missing person info" });
    return;
  }

  const existingPerson = persons.find((p) => p.name === content.name);

  if (existingPerson) {
    res.status(400).json({ error: "name must be unique" });
    return;
  }

  const newPerson = {
    name: content.name,
    number: content.number,
    id: generateId(),
  };

  persons = persons.concat(newPerson);

  res.status(201).json({ newPerson });
});

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
