const mongoose = require('mongoose');
//
mongoose.connect('mongodb://localhost:27017/online_testing', { useNewUrlParser: true });
//
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('messages Connection successful :D')
});

const MessagesSchema = mongoose.Schema({
    from : String,
    to : String,
    Message : String
});

module.exports = mongoose.model('Messages', MessagesSchema);
