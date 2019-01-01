const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Exam = require('../models/Exams.js');
const newExam = mongoose.model('Exams');

const message = require('../models/messages.js');
const newMessage = mongoose.model('Messages');

const Question = require('../models/Questions.js');
const newQuestion = mongoose.model('Questions');

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

///////////////////////// Generate Exam By username ///////////////////////////

router.post('/generateExam', function (req, res) {
    let questions_object = req.body.questions;
    let userName =  req.body.userName;
    let type = req.body.type;
    console.log("questions " + JSON.stringify(questions_object));
    console.log(req.body.type);
    console.log("GENERATE EXAM");
    let question_list = [];
    questions_object = JSON.parse(questions_object);
    for (let i = 0 ; i < questions_object.length ; i++){
        console.log(questions_object[i].question)
    }
    questions_object = shuffleArray(questions_object);
    for (let i = 0; i < questions_object.length; i++) {
        question_list.push({question: questions_object[i].question, solution: '', correct: false});
    }
    const newExam = new Exam({
        userName: userName,
        type : type,
        Questions: question_list,
        score: 0,
        state: false
    });
    newExam.save().then(result => {
    }).catch(err => console.log(err));
    const newMessage = new message({
        from : req.session.userName,
        to : userName,
        Message :"you have " + type +  "exam "
    });
    newMessage.save().then(result => {

    }).catch(err => console.log(err));
    res.send("finished");
});

///////////////////////// Get Exam Type ///////////////////////////

router.post('/returnExamType', function (req, res) {
    const examType = req.body.hiddenInput;
    res.render('examPage', {message: examType});
});

///////////////////////// Render To Solved Exam Page ///////////////////////////

router.post('/goToSolvedExam', function (req, res) {
    let examID = req.body.hiddenInput;
    res.render('solvedExamPage', {message: examID});

});

///////////////////////// GET Exam By ID //////////////////////////////

router.post('/getExamByID', function (req, res) {
    const examID = req.body.examID;
    let userName = req.session.userName;
    let query = newExam.findOne({"_id": examID});
    query.exec(function (err, exam) {
        res.send({exam:exam , userName:userName});
    });
});

///////////////////////// GET Exam By username //////////////////////////////

router.post('/getExam', function (req, res) {
    let userName = req.session.userName;
    const type = req.body.type;
    let query = newExam.findOne({'userName': userName, 'type': type, 'state': false});
    query.exec(function (err, exam) {
        res.send(exam);
    });
});

///////////////////////// Generate Question's Answers ////////////////////////

router.post('/getAnswers', function (req, res) {
    const exam = JSON.parse(req.body.exam);
    let quesion_list = [];
    let Answer_list = [];
    let final_questions = [];
    let query = newQuestion.find();
    query.exec(function (err, ques) {
        //     for getting the questions inside a callback and their answers
        for (let i = 0; i < exam.Questions.length; i++) {
            for (let j = 0; j < ques.length; j++) {
                if (exam.Questions[i].question === ques[j].question) {
                    quesion_list.push(ques[j].question);
                    Answer_list.push([ques[j].correctAnswer, ques[j].wrong1, ques[j].wrong2, ques[j].wrong3, ques[j].wrong4]);
                }
            }
        }
        //   randomize the answers
        for (let i = 0; i < quesion_list.length; i++) {
            let ar = [Answer_list[i][1], Answer_list[i][2], Answer_list[i][3], Answer_list[i][4]];
            let arr = shuffleArray(ar);
            arr = shuffleArray([arr[0], arr[1], arr[2], Answer_list[i][0]]);
            final_questions.push([quesion_list[i], arr[0], arr[1], arr[2], arr[3]]);
        }
        res.send(final_questions);

    });


});

///////////////////////// Check Question Answer //////////////////////////////

router.post('/checkQuestion', function (req, res) {
    let flag = false;
    let solved = JSON.parse(req.body.ques);
    if(req.session.userName !== undefined){
    newQuestion.findOne({'question': solved.question}).then(function (question) {
        if (question.correctAnswer === solved.answer) {
            flag = true;
        }
        newExam.updateOne({'_id': solved.examID, 'state': false, 'Questions.question': solved.question},
            {$set: {'Questions.$.solution': solved.answer, 'Questions.$.correct': flag}}).then(function (err) {});
        res.send(flag);
    })}
    else{
        res.send("timeOut");
    }
});

///////////////////////// Get Exam Score ////////////////////////////////////

router.post('/correctExam', function (req, res) {
    let examScore = 0;
    let id = req.body.id;
    newExam.findOne({'_id': id}).then(function (exam) {
        for (let i = 0; i < exam.Questions.length; i++) {
            if (exam.Questions[i].correct === true) {
                examScore++;
            }
        }
        newExam.updateOne({'_id': id},
            {$set: {'score': examScore, 'state': true}}).then(function (err) {
                console.log(err);
                const newMessage = new message({
                    from : "System",
                    to : "HR",
                    Message :req.session.userName + " has finished his/her " + exam.type + " Exam"
                });
                newMessage.save().then(result => {
                        res.send("");

                }).catch(err => console.log(err));

        });
    });
});

///////////////////////// Get Exams ID Of specific Candidate ////////////////////////////////////

router.post('/getExamButtons', function(req,res){
    const userName = req.body.userName;

    const query = newExam.find({'userName': userName, 'state': true});
    query.exec(function (err, exams) {
        let length = exams.length;
        let exams_list = [];
        for (let i = 0; i < length; i++) {
            exams_list.push(exams[i]._id);
        }
        res.jsonp({length: length, array:exams_list });

    });
});

///////////////////////// Get Exams By UserName Of specific Candidate ////////////////////////////////////

router.post('/getExams', function(req,res){
    const userName = req.body.userName;

    const query = newExam.find({'userName': userName, 'state': true});
    query.exec(function (err, exams) {
        let length = exams.length;
        let exams_list = [];
        for (let i = 0; i < length; i++) {
            exams_list.push(exams[i]);
        }

        res.jsonp({length: length, array:exams_list});

    });
});

//////////////////////////////////// Get exams ////////////////////////////////////////

router.post('/searchExam', function(req,res){
    let searchInput = req.body.searchInput;
    newExam.find( { $or:[{'type': searchInput}, {'userName': searchInput}]},function(err,exam){
        res.send(exam);
    });
});

module.exports = router;
