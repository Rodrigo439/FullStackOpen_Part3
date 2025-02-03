const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

// Middleware setup
app.use(express.json()); // Allows JSON requests
app.use(cors()); // Enables CORS to allow frontend requests

// Morgan for logging HTTP requests
morgan.token('object', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object'));

// Sample in-memory database
let persons = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
  { id: 3, name: "Dan Abramov", number: "12-43-234345" },
  { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" }
];

// Set up the port (Render or local)
const PORT = process.env.PORT || 3001;

// Get all contacts
app.get('/api/persons', (req, res) => {
  res.json(persons);
});

// Get general information
app.get('/info', (req, res) => {
  const totalPersons = persons.length;
  const currentTime = new Date();
  res.send(`<p>Phonebook has info for ${totalPersons} people</p><p>${currentTime}</p>`);
});

// Get a contact by ID
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(p => p.id === id);
  
  person
    ? res.json(person)
    : res.status(404).json({ error: "Person not found" });
});

// Delete a contact by ID
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);
  res.status(204).end();
});

// Add a new contact
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Error starting server:', err);
});
