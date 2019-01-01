const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/online_testing', { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Candidate Connection successful :D')
});

const CandidateSchema = mongoose.Schema({
    name: String,
    userName: String,
    email: String,
    password: String,
    telephoneNumber: String,
    cv: String,
    approved: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Candidate', CandidateSchema);
