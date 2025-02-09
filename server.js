const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const app = express();
const Person = require('./models/personData')

// Middleware setup
app.use(express.json()); // Allows JSON requests
app.use(cors()); // Enables CORS to allow frontend requests
app.use(express.static('dist')) //for the use of dist in production build

// Morgan for logging HTTP requests
morgan.token('object', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object'));

// Set up the port (Render or local)
const PORT = process.env.PORT || 3001;

// Get all contacts

app.get("/api/persons",(req,res) => {
  Person.find({}).then((persons)=>{
    if (persons){
      res.json(persons)
    }else{
      res.status(404).end()
    }
  }).catch(error=>{
    console.log(error)
    res.status(500).end()
  })
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body.name === undefined) {
    return res.status(400).json({ error: 'name missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  }).catch(error=>{
    console.log(error)
    res.status(500).json({error: "failed to save data"})
  })
})

app.delete('/api/persons/:id', (req,res)=>{
  Person.findByIdAndDelete(req.params.id).then((result)=>{
    res.status(204).end()
  }).catch(error=>{
    console.log(error)
    res.status(500).json({error: "failed to delete data"})
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Error starting server:', err);
});
