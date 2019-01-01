const mongoose = require('mongoose');
//
mongoose.connect('mongodb://localhost:27017/online_testing', { useNewUrlParser: true });
//
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Questions Connection successful :D')
});

const QuestionsSchema = mongoose.Schema({
    question: String,
    correctAnswer: String,
    wrong1: String,
    wrong2: String,
    wrong3: String,
    wrong4:String,
    field: String
});

module.exports = mongoose.model('Questions', QuestionsSchema);
