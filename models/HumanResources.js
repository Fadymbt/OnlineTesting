const mongoose = require('mongoose');
//
mongoose.connect('mongodb://localhost:27017/online_testing', { useNewUrlParser: true });
//
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('HR Connection successful :D')
});

const HumanResourcesSchema = mongoose.Schema({
    userName: String,
    password: String,
    email: String
});

module.exports = mongoose.model('HumanResources', HumanResourcesSchema);