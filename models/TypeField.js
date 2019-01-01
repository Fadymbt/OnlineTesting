const mongoose = require('mongoose');
//
mongoose.connect('mongodb://localhost:27017/online_testing', { useNewUrlParser: true });
//
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('TypeField Connection successful :D')
});

const TypeFieldSchema = mongoose.Schema({
    type: String,
    field: [{
        type: String
    }]

});

module.exports = mongoose.model('TypeField', TypeFieldSchema);