const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://rodrigoantelo0:${password}@fullstackopenphonebookb.zspvn.mongodb.net/FullStackOpen_PhonebookBackend?retryWrites=true&w=majority&appName=FullStackOpenPhonebookBackend`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);
if(!name && !number) {
    Person.find({}).then((result)=>{
        console.log('phonebook: ')
        result.forEach((person)=>{
            console.log(`${person.name} ${person.number}`)
        });
        mongoose.connection.close();
    }).catch((err)=>{
        console.error("Sn error has occurren when fetching person data: ", err)
        mongoose.connection.close()
    });
} else {
    const person = new Person({
        name,
        number,
    });
        
    person.save().then((result) => {
        console.log(`Added ${name} number: ${number} to the Phonebook`)
        mongoose.connection.close()
    }).catch((err)=>{
        console.error("An error has occurred when registering a Person: ", err)
        mongoose.connection.close()
    });
}


