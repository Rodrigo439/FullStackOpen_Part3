const express = require('express');
const morgan = require('morgan');

const app = express();
const PORT = 3001;

// Middleware para procesar JSON
app.use(express.json());

// Configurar morgan para registrar las solicitudes
morgan.token('object', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object'));

let persons = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
  { id: 3, name: "Dan Abramov", number: "12-43-234345" },
  { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" }
];

// Ruta para obtener información general
app.get('/info', (req, res) => {
  const totalPersons = persons.length;
  const currentTime = new Date();
  res.send(`<p>Phonebook has info for ${totalPersons} people</p><p>${currentTime}</p>`);
});

// Ruta para obtener una persona por ID
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const entry = persons.find(entry => entry.id === id);
  entry ? res.json(entry) : res.status(404).json({ error: "Person not found" });
});

// Ruta para eliminar una persona por ID
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(entry => entry.id !== id);
  res.status(204).end();
});

// Ruta para agregar una nueva persona
app.post('/api/persons', (req, res) => {
  console.log("Request Body:", req.body); // Para depuración

  const body = req.body;

  // Validar datos
  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'Name or number is missing' });
  }

  // Verificar duplicados
  if (persons.find(person => person.name === body.name)) {
    return res.status(400).json({ error: 'Name must be unique' });
  }

  // Generar un nuevo ID
  const newId = Math.floor(Math.random() * 10000);

  // Crear la nueva entrada
  const newEntry = { id: newId, name: body.name, number: body.number };

  // Agregar la nueva entrada a la lista
  persons = persons.concat(newEntry);

  // Enviar la nueva entrada como respuesta
  res.json(newEntry);
});

// Ruta para obtener todas las personas
app.get('/api/persons', (req, res) => {
  res.json(persons);
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
