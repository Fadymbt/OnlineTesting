const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadedCVs = multer({dest: './public/uploadedCVs'});
const mongoose = require('mongoose');
const fs = require('fs');

const HumanResources = require('../models/HumanResources.js');
const newHR = mongoose.model('HumanResources');
const newCandidate = mongoose.model('Candidate');

const message = require('../models/messages.js');
const newMessage = mongoose.model('Messages');


router.get('/', function (req, res) {
    res.send('respond with a resource');
});

///////////////////////// LOGIN HR //////////////////////////////

router.get('/login', function (req, res) {
    res.render('humanResourceLogin', {message: ''});
});

router.post('/homepage2', function (req, res) {
    res.send('String');
});

let sessionChecker = (req, res, next) => {
    if (req.session.userName) {
        next();
    } else {
        res.render("candidateRegister", {message: ""});
    }

};

router.get('/homepage', sessionChecker, function (req, res) {
    res.render('humanResourcesHomePage', {message: req.session.userName});
});

router.post('/searchPage', function (req, res) {
    let searchCriteria = req.body.searchCriteria;
    res.render('searchPage', {message: searchCriteria});
});

router.post('/login', function (req, res) {
    let userName = req.body.userName;
    let password = req.body.password;

    newHR.count({userName: userName}, function (err, count) {
        if (count > 0) {
            const query = newHR.findOne({'userName': userName});
            query.select('password');
            query.exec(function (err, hr) {
                if (err) return handleError(err);
                else if (hr.password === password) {
                    req.session.userName = userName;
                    res.redirect('homepage');
                } else {
                    res.render('humanResourceLogin', {message: 'Wrong password'});
                }
            });
        } else {
            res.render('humanResourceLogin', {message: 'Wrong UserName'});
        }
    });

});

///////////////////////// Confirm Candidates //////////////////////////////

router.get('/getDisapprovedCandidates', sessionChecker, function (req, res) {

    const query = newCandidate.find({'approved': 'false'});

    query.select('userName');

    query.exec(function (err, cand) {
        if (err) return handleError(err);
        if (cand !== null) {
            res.send(cand);
        } else {
            console.log('Error');
        }
    });

});

///////////////////////// Change Candidate approval state //////////////////////////////

router.post('/changeApprovalState', function (req, res) {
    let userName = req.body.userName;
    let operation = req.body.operation;

    if (operation === "approved") {
        newCandidate.update({userName: userName}, {$set: {approved: true}}, function () {
            console.log("Candidate approved correctly");
        });
    } else if (operation === "disapproved") {
        newCandidate.deleteOne({userName: userName}, function () {
            console.log("Candidate removed");
        });
    } else {
        console.log('Error');
    }
});

///////////////////////// Show Candidate CV //////////////////////////////

router.post('/showCV', function (req, res) {
    const query = newCandidate.findOne({userName: req.body.userName});

    query.select("cv");

    query.exec(function (err, cand) {
        if (err) return handleError(err);
        if (cand !== null) {
            let tempFile = "/uploadedCVs/" + cand.cv;
            console.log(tempFile);
            res.send(tempFile);
        } else {
            console.log("Error");
        }
    })
});

///////////////////////// Get Approved Candidates //////////////////////////////

router.get('/getApprovedCandidates', sessionChecker, function (req, res) {

    const query = newCandidate.find({'approved': 'true'});

    query.select('userName');

    query.exec(function (err, cand) {
        if (err) return handleError(err);
        if (cand !== null) {
            res.send(cand);
        } else {
            console.log('Error');
        }
    });

});

///////////////////////////// return messages ////////////////////////

router.get('/getMessages', sessionChecker, function (req, res) {
    newMessage.find({'from': "System"}).then(function (Message) {
        res.send(Message);
    });
});

/////////////////////// logout /////////////////////

router.get('/logout', sessionChecker, function (req, res) {
    req.session.destroy();
    res.render('humanResourceLogin', {message: ''});
});

module.exports = router;
