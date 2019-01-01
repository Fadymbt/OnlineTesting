const mongoose = require('mongoose');
//
mongoose.connect('mongodb://localhost:27017/online_testing', { useNewUrlParser: true });
//
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Exams Connection successful :D')
});

const ExamsSchema = mongoose.Schema({
    userName: String,
    type : String,
    Questions: [{
        _id: false,
        question: String,
        solution: String,
        correct: Boolean
    }],
    score: Number,
    state : Boolean
});
module.exports = mongoose.model('Exams', ExamsSchema);
//
// module.exports.findExamByUserName = function(userName, type, callback){
//     Exam.find({'userName': userName, 'type' : type}, callback);
// };


