const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

//Schema for the correct validation of the person data
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'The name "{VALUE}" is too short, minimum allowed is 3 characters'],
    required: [true, 'The name field is required'],
  },
  number: {
    type: String,
    required: true,
    validate:{
      validator:function(val){
        //regular expresion to validate the format of the number
        return /^(\d{2,3})-\d+$/.test(val) && val.length >= 8
      },
      message: (props) => `${props.value} isn't a valid number`,
    },
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
