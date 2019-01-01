let fullExam ;
let Questions = null;
let userName = '';
let markCounter = 0;
let timer;
function makeTimer(endTime) {

    let now = new Date();
    now = (Date.parse(now) / 1000);
    endTime = (Date.parse(endTime) / 1000);
    let timeLeft = endTime - now;

    let days = Math.floor(timeLeft / 86400);
    let hours = Math.floor((timeLeft - (days * 86400)) / 3600);
    let minutes = Math.floor((timeLeft - (days * 86400) - (hours * 3600)) / 60);
    let seconds = Math.floor((timeLeft - (days * 86400) - (hours * 3600) - (minutes * 60)));

    if (minutes < "10") {
        minutes = "0" + minutes;
    }
    if (seconds < "10") {
        seconds = "0" + seconds;
    }

    if (minutes >= 0 && minutes <= 10 && seconds >= 0) {
        $("#minutes").html("<h1 id='mins'>" + minutes + "</h1>" + "<span> Minutes </span>");
        $("#minutes").val(minutes);
        $("#seconds").val(seconds);
        $("#seconds").html("<h1 id='secs'>" + seconds + "</h1>" +  "<span> Seconds </span>");
    } else {
        $("#minutes").html("<h1 id='mins'>00</h1>" + "<span> Minutes </span>");
        $("#seconds").html("<h1 id='secs'>00</h1>" + "<span> Seconds </span>");
        $("#minutes").val("00");
        $("#seconds").val("00");
    }
}

$(document).ready(() => {
    let endTime = new Date();
   endTime.setMinutes(endTime.getMinutes() + 1);

    setInterval(function () {
        makeTimer(endTime);
    }, 1000);
    const examType = $('#examType').text();
    $.ajax({
        type: 'POST',
        async: false,
        url: '/exams/getExam',
        data: {type: examType},
        success: function (res) {
            userName = res.userName;
            fullExam = res;

        }
    });

    $('#welcome').html("<p> welcome " + userName + '</p>');
});

$(document).ready(() => {
    $.ajax({
        type: 'POST',
        url: '/exams/getAnswers',
        data: {exam: JSON.stringify(fullExam)},
        async: false,
        success: function (res) {
            Questions = res;
        }
    });
    for (let i = 0; i < Questions.length; i++) {
        $('#exam').after('<br> <p id="question">' + Questions[i][0] +"     " +
            '<input type="checkbox" class="mark" name="mark" value="skip" id="skip" > mark </p>');

        for (let j = 1; j <= 4; j++) {
            $('#question').after('<input type="radio" name="question,' + i + '" value="' + j + '">' + Questions[i][j] + '<br>');

        }
    }
});

$(document).ready(() => {
    $("input[type ='radio']").click(function () {
        if ($("#minutes").val() !== '00' || $('#seconds').val() !== '00') {
            let correct = false;
            let name = $(this).attr('name');
            let answer_number = $(this).val();
            let question_number = (name.split(','))[1];
            let question_solved = Questions[question_number][0];
            let answer_chosen = Questions[question_number][answer_number];
            let array = {
                examID: fullExam._id,
                exam: fullExam.type,
                question: question_solved,
                answer: answer_chosen
            };

            fullExam.Questions[question_number].solution = answer_chosen;
            $('#hiddenInput').val(fullExam._id);

            $.ajax({
                type: "POST",
                url: "/exams/checkQuestion",
                data: {
                    ques: JSON.stringify(array)
                },
                success: function (res) {
                    correct = res;
                }
            });
        } else {
            alert("sorry times out Please press submit to submit the already existing answers");
        }
    });

});

$(document).on("change", '[type=checkbox]' ,function() {
        markCounter += this.checked ? 1 : -1;
        $('#mark').html( '<h3> you skipped (' + markCounter + ') questions</h3>');
});

$(document).on("click", '#submit' ,function() {
    $("#minutes").html("<h1 id='mins'>00</h1>" + "<span> Minutes </span>");
    $("#seconds").html("<h1 id='secs'>00</h1>" + "<span> Seconds </span>");
    $("#minutes").val("0");
    $("#seconds").val("0");
    $.ajax({
        type: 'POST',
        url: '/exams/correctExam',
        async : false,
        data: {id: $("#hiddenInput").val()},
        success: function (res) {
        }
    });
    $.ajax({
        type: 'POST',
        async : false,
        url: '/candidates/examMessagesButtons',
        data:{
            state: false
        },
        success: function (res) {
            let length = JSON.parse(res).length;
            let array = JSON.parse(res).array;
            if (length !==0){
                $('#nextExam').after('<button type="submit" class="col-md-2 btn btn-dark" id="' + array[0] + '">' + array[0] + '</button>' );
                $('#hiddenInput2').val(array[0]);
            }
            else{
                $('#backButton').click();
            }

        }
    });


});

