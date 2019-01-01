$(document).ready(()=>{
   let searchInput = $("#hiddenID").val();
    $.ajax({
        type: 'POST',
        url: '/candidates/searchCandidate',
        data:{
            searchInput: searchInput
        },
        success: function (res) {
            if (res.length > 0){
                $("#candidates").append('<div class="jumbotron" id="candidate"></div>');
                for (let i = 0 ; i < res.length ; i++){
                    $("#candidate").append(
                        '<h4> Candidate name : ' + res[i].name +'</h4>' +
                        '<h4> Candidate username : ' + res[i].userName +'</h4>' +
                        '<h4> Candidate email : ' + res[i].email +'</h4>' +
                        '<h4> Candidate telephone number : ' + res[i].telephoneNumber +'</h4>' )
                }
            }
        }
    });

    $.ajax({
        type: 'POST',
        url: '/exams/searchExam',
        data:{
            searchInput: searchInput
        },
        success: function (res) {
            if (res.length > 0){
                for (let j = 0 ; j < res.length ; j++){
                    $("#exams").append('<div class="jumbotron" id="exam'+ j +'"></div>');
                    $("#exam" + j).append(
                        '<h4> Exam username : ' + res[j].userName +'</h4>' +
                        '<h4> Exam type : ' + res[j].type +'</h4>' +
                        '<h4> Exam score : ' + res[j].score +'</h4>' +
                        '<h4> Exam state : ' + res[j].state +'</h4>' );
                    for (let i = 0; i < res[j].Questions.length; i++) {
                        $("#exam" + j).append('<p class="text-center alert alert-primary">' + res[j].Questions[i].question + '</p>');
                        if (res[j].Questions[i].correct === true)
                        {
                            $("#exam" + j).append('<p class="text-center alert alert-success">' + res[j].Questions[i].solution + '</p>');
                        }
                        else if (res[j].Questions[i].correct === false) {
                            $("#exam" + j).append('<p class="text-center alert alert-danger">' + res[j].Questions[i].solution + '</p>');
                        }
                    }
                    $("#exam" + j).append('<br>');
                }
            }
        }
    });

});