let fullExam = null;
let userName = '';
$(document).ready(() => {
    let examID = $("#hiddenID").val();
    $.ajax({
        type: 'POST',
        url: '/exams/getExamByID',
        async: false,
        data: {
            examID: examID
        },
        success: function (res) {
            fullExam = res.exam;
            userName = res.userName;
        }
    });
    $('#welcome').html('<p> welcome HR:' +userName + '</p>');
    for (let i = 0; i < fullExam.Questions.length; i++) {
        if (fullExam.Questions[i].correct === true)
        {
            $("#exam").after('<p class="text-center alert alert-success">' + fullExam.Questions[i].solution + '</p>');
        }
        else if (fullExam.Questions[i].correct === false) {
            $("#exam").after('<p class="text-center alert alert-danger">' + fullExam.Questions[i].solution + '</p>');
        }
        $("#exam").after('<p class="text-center alert alert-secondary">' + fullExam.Questions[i].question + '</p>');
    }

});
