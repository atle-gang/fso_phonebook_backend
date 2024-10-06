const express = require("express");
const app = express();

let persons = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get("/info", (request, response) => {
  response.setHeader('Date', new Date().toUTCString());
  const responseDate = response.getHeaders().date
  response.send(
    `<p>Phone book has info for ${persons.length} people</p>
    <p>${responseDate}</p>
    `);
})

app.get("/api/persons", (request, response) => {
  response.json(persons);
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
})

const PORT = 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})