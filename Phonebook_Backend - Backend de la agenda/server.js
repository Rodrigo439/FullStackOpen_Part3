const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(cors());

// Morgan para logging
morgan.token('object', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object'));

let persons = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
  { id: 3, name: "Dan Abramov", number: "12-43-234345" },
  { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" }
];

// Obtener toda la agenda
app.get('/api/persons', (req, res) => {
  res.json(persons);
});

// Obtener info general
app.get('/info', (req, res) => {
  const totalPersons = persons.length;
  const currentTime = new Date();
  res.send(`<p>Phonebook has info for ${totalPersons} people</p><p>${currentTime}</p>`);
});

// Obtener un contacto por ID
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(p => p.id === id);
  person ? res.json(person) : res.status(404).json({ error: "Person not found" });
});

// Eliminar un contacto
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);
  res.status(204).end();
});

// Agregar un nuevo contacto
app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: 'Name or number is missing' });
  }

  if (persons.find(person => person.name === name)) {
    return res.status(400).json({ error: 'Name must be unique' });
  }

  const newPerson = {
    id: Math.floor(Math.random() * 10000),
    name,
    number
  };

  persons = [...persons, newPerson];
  res.json(newPerson);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('Error starting server:', err);
});
