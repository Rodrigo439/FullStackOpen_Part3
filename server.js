const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const app = express()
const Person = require('./models/personData')

// Middleware setup
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

// Morgan for HTTP logs
morgan.token('object', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object'))

// Set up the port
const PORT = process.env.PORT || 3001

// GET all contacts
app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons)
    })
    .catch((error) => next(error))
})

// POST new contact for add to the phonebook
app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'Name or number is missing' })
  }

  const person = new Person({ name, number })

  person.save()
    .then(savedPerson => res.json(savedPerson))
    .catch((error) => next(error))
})

// DELETE contact
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      if (result) {
        res.status(204).end()
      } else {
        res.status(404).json({ error: 'Contact not found' })
      }
    }).catch((error) => next(error))
})

// PUT route with validation fix
app.put('/api/persons/:id', (req, res, next) => {
  const { id } = req.params
  const { name, number } = req.body

  Person.findByIdAndUpdate(id,{ name, number },{ new: true, runValidators: true, context: 'query' })
    .then((updatedPerson) => {
      if (updatedPerson) {
        res.json(updatedPerson)
      } else {
        res.status(404).json({ error: 'Person not found' })
      }
    })
    .catch((error) => next(error))
})

// GET individual entry
app.get('/api/persons/:id', (req, res, next) => {
  const { id } = req.params

  Person.findById(id)
    .then((person) => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

// GET info about phonebook
app.get('/info', (req, res, next) => {
  Person.find()
    .then((personEntries) => {
      res.send(`Phonebook has information for ${personEntries.length} people.\n On the day ${Date()}`)
    })
    .catch((error) => next(error))
})

//  Middleware for error handling
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'Malformatted ID' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}).on('error', (err) => {
  console.error('Error starting server:', err)
})
