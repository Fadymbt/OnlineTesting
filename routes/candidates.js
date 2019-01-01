const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadedCVs = multer({dest: './public/uploadedCVs'});
// const uploadedCVs = multer({dest: './uploadedCVs'});
const mongoose = require('mongoose');

const Candidate = require('../models/Candidate.js');
const newCandidate = mongoose.model('Candidate');
const Exams = require('../models/Exams.js');
const newExam = mongoose.model('Exams');
const TypeField = require('../models/TypeField.js');

const message = require('../models/messages.js');
const newMessage = mongoose.model('Messages');

/* GET candidates listing. */
router.get('/', function (req, res) {
    res.send('respond with a resource');
});

let sessionChecker = (req, res, next) => {
    if (req.session.userName) {
        next();
    } else {
        res.render("candidatesLogin", {message: ""});
    }

};

///////////////////////// LOGIN Candidate //////////////////////////////

router.get('/login', function (req, res) {
    res.render('candidatesLogin', {message: null});
});

router.get('/homepage', sessionChecker, function (req, res) {
    res.render('candidateHomePage', {message: req.session.userName});
});

router.post('/login', function (req, res) {
    let userName = req.body.userName;
    let password = req.body.password;

    newCandidate.count({userName: userName}, function (err, count) {
        if (count > 0) {
            const query = newCandidate.findOne({'userName': userName});

            query.select('password approved');

            query.exec(function (err, cand) {
                if (err) return handleError(err);
                if (cand.password === password) {
                    if (cand.approved === true) {
                        req.session.userName = userName;
                        res.redirect('homepage');
                    } else {
                        res.render('candidatesLogin', {message: 'User was not approved'});
                    }
                } else {
                    res.render('candidatesLogin', {message: 'Wrong Password'});
                }
            });
        } else {
            res.render('candidatesLogin', {message: 'Wrong UserName'});
        }
    });

});

///////////////////////// REGISTER Candidate //////////////////////////////

router.get('/register', function (req, res) {
    res.render('candidateRegister');
});

router.post('/checkUserName', function (req, res) {
    const userName = req.body.userName;

    newCandidate.count({userName: userName}, function (err, count) {
        if (count > 0) {
            res.send('taken');
        } else {
            res.send('notTaken');
        }
    });
});

router.post('/register', uploadedCVs.single('cv'), function (req, res) {
    let name = req.body.name;
    let userName = req.body.userName;
    let email = req.body.email;
    let password = req.body.password;
    let telNum = req.body.telNum;

    let cv;
    if (req.file) {
        cv = req.file.filename;
    } else {
        cv = 'noCV.pdf';
    }

    const newCand = new Candidate({
        name: name,
        userName: userName,
        email: email,
        password: password,
        telephoneNumber: telNum,
        cv: cv
    });

    newCand.save().then(result => {
    }).catch(err => console.log(err));

    res.render('candidatesLogin', {message: null});


});

//////////////////////////////////// Get Exams Of specific Candidate ////////////////////////////////////////

router.post('/examMessagesButtons', function (req, res) {
    const userName = req.session.userName;
    let exams_list = [];
    let length = 0;
    let message = [];
    newExam.find({'userName': userName, 'state': false}).then(function (exams) {
        length = exams.length;
        for (let i = 0; i < length; i++) {
            exams_list.push(exams[i].type);
        }
        newMessage.find({'to': userName}).then(function (Message) {
            message = Message;
            res.send(JSON.stringify({message: message, length: length, array: exams_list}));
        });


    });


});

//////////////////////////////////// Get Candidate ////////////////////////////////////////

router.post('/searchCandidate', function (req, res) {
    let searchInput = req.body.searchInput;
    newCandidate.find({$or: [{'name': searchInput}, {'userName': searchInput}, {'email': searchInput}]}, function (err, candidate) {
        res.send(candidate);
    });
});

/////////////////////////////////////return to homePage ///////////////////////////////////

router.get('/homepage', sessionChecker, function (req, res) {
    res.render('candidateHomePage', {message: req.session.userName});
});

////////////////////////////// logout /////////////////////////////////////

router.get('/logout', sessionChecker, function (req, res) {
    req.session.destroy();
    res.render("candidatesLogin", {message: ''});
});

module.exports = router;
