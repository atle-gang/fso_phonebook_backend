const express = require("express");
const app = express();

require('dotenv').config();

const Person = require("./models/person");

const morgan = require("morgan");
const cors = require("cors");

app.use(express.static('dist'))
app.use(cors())

let persons = [
]

app.use(express.json());

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

const generateId = () => String(Math.floor(Math.random() * (200 - 1) + 1));

app.get("/info", (request, response) => {
  response.setHeader("Date", new Date().toUTCString());
  const responseDate = response.getHeaders().date;
  response.send(
    `<p>Phone book has info of ${persons.length} people</p>
    <p>${responseDate}</p>
    `
  );
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons);
  });
});

app.get("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson);
  })
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person);
  })
})

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.statusMessage = `Person with id ${id} not found`;
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);

  response.status(404).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number is missing"
    });
  }

  const nameExists = persons.some((person) => person.name === body.name);

  if (nameExists) {
    return response.status(400).json({
      error: "name must be unique"
    });
  }

  const person = {
    name: body.name,
    id: generateId(),
    number: body.number
  };

  persons = persons.concat(person);
  response.json(person);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
