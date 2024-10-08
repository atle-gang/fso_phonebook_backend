const express = require("express");
const app = express();
require('dotenv').config();

const Person = require("./models/person");

const morgan = require("morgan");

app.use(express.static('dist'));

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") return response.status(400).send({ error: "malformatted id" });
  if (error.name === "ValidationError") return response.status(400).json({ error: error.message });
  next(error);
};

const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

const unknownEndPoint = (request, response) => {
  response.status(404).send({ error: "Unknown endpoint" });
};

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
  });

  person.save().then(savedPerson => {
    response.json(savedPerson);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number is missing"
    });
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number
  });

  newPerson.save()
    .then(savedPerson => {
      response.json(savedPerson);
    })
    .catch(error => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const personToBeUpdated = {
    name: body.name,
    number: body.number
  };

  Person.findByIdAndUpdate(request.params.id, personToBeUpdated, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson);
    })
    .catch(error => next(error));
});

app.use(unknownEndPoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
