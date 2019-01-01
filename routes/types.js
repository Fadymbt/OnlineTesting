const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Type = require('../models/TypeField.js');
const newType = mongoose.model('TypeField');

const Question = require('../models/Questions.js');
const newQuestion = mongoose.model('Questions');

const Exam = require('../models/Exams.js');
const newExam = mongoose.model('Exams');

///////////////////////// shuffle  //////////////////////////////

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

///////////////////////// Get Exam Types //////////////////////////////

router.post('/getExamTypes', function (req, res) {
    const query = newType.find();

    query.select('type field');

    query.exec(function (err, types) {
        if (err) return handleError(err);
        if(types !== null){
            res.send(types);
        }
        else {
            console.log('Error');
            res.send("error");
        }
    });
});

///////////////////////// GET Questions //////////////////////////////

router.post('/getQuestions', function (req, res) {
    let fieldName = req.body.fieldName;
    newQuestion.count({"field": fieldName}, function (err, count){
        if(count > 0){
            const query = newQuestion.find({"field": fieldName});

            query.exec(function (err, questions) {
                if (err) return handleError(err);

                if(questions !== null){
                    questions = shuffleArray(questions);

                    res.send(questions);
                }
                else {
                    console.log('Error');
                }
            });
        }
        else {res.send([])}
    });
});

module.exports = router;
