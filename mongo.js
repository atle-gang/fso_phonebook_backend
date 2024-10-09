const mongoose = require("mongoose");

const password = process.argv[2];

if (!password) {
  console.log("Please provide the password as an argument: node mongo.hs <password> <name> <number>");
  process.exit(1);
}

const url = `mongodb+srv://atlegangcode:${password}@cluster0.blicn.mongodb.net/phoneBookApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('Phone book:');
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  }).catch(error => {
    console.error("Error fetching entries:", error);
  });
} else if (process.argv.length === 5) {
  const personName = process.argv[3];
  const personNumber = process.argv[4];

  const person = new Person({
    name: personName,
    number: personNumber
  });

  person.save().then(result => {
    console.log(`Added ${personName} ${personNumber} to phone book`);
    mongoose.connection.close();
  }).catch(error => {
    console.error("Error saving entry:", error);
    mongoose.connection.close();
  });
} else {
  console.log("Please provide either just the password or the password, name, and number");
  mongoose.connection.close();
}
