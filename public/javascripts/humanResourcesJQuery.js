$(document).ready(() =>{
    $.ajax({
        type : "GET",
        url : '/humanResources/getMessages',
        success:function (res) {
            for (let i = 0; i <res.length ; i++) {
                $('#messageTable').append('<tr><td class="text-center"> '+res[i].from +'</td><td class="text-center">' + res[i].Message + '</td></tr>')
        }}
    });

    $.ajax({
        type: 'GET',
        url: '/humanResources/getDisapprovedCandidates',
        success: function (res) {
            let cand = res;
            if (res !== null)
            {
                for (let i = 0; i < cand.length; i++) {
                    $('#table').after('<tr id=\'' + cand[i].userName + '\'>\n' +
                        '<td class="text-center">' + cand[i].userName + '</td>\n' +
                        '<td class="text-center"><button id=\''+ cand[i].userName +'\' name="showCV" class="btn btn-primary"> View CV </button></td>\n' +
                        '<td class="text-center"><button id=\''+ cand[i].userName +'\' name="approved" class="btn btn-primary"> Approve </button></td>\n' +
                        '<td class="text-center"><button id=\''+ cand[i].userName +'\' name="disapproved" class="btn btn-danger"> Disapprove </button></td>\n' +
                        '</tr>');
                    $('#userName').val("");
                }
            }
            else {alert('Nothing to show here');}
        }
    });

    $.ajax({
        type: 'GET',
        url: '/humanResources/getApprovedCandidates',
        success: function (res) {
            let cand = res;
            if (res !== null)
            {
                for (let i = 0; i < cand.length; i++) {
                    $('#candTests').after(
                        '<tr id=\'' + cand[i].userName + '\'>\n' +
                        '<td class="text-center">' + cand[i].userName + '</td>\n' +
                        '<td class="text-center"><button id=\''+ cand[i].userName +'\' name="showFullTest" class="btn btn-primary"> ShowFullTest </button></td>\n' +
                        '<td class="text-center"><button id=\''+ cand[i].userName +'\' name="addTest" class="btn btn-primary"> Add Test </button></td>\n' +
                        '<td class="text-center"><button id=\''+ cand[i].userName +'\' name="summarizedReport" class="btn btn-primary"> Summarized Report </button></td>\n' +
                        '</tr>');
                    $('#userName').val("");
                }
            }
            else {alert('Nothing to show here');}
        }
    });
});

$(document).on('click', 'button',function() {
    let userName = this.id;
    let operation = this.name;
    if(operation === "search"){
        $.ajax({
           type: 'POST',
            url: '/humanResources/search',
            data: {
               searchCriteria: $('#searchCriteria').id
            },

        });
    }
    if(operation === "showCV"){
        let flag = true;
        if($('#pdf').is(':empty')){
            $.ajax({
                type: 'POST',
                url: '/humanResources/showCV',
                data:{
                    userName: userName
                },
                success: function(res) {
                    $('#pdf').append('<embed id="cv" src="' + res + '" type="application/pdf" width="100%" height="600px" />');
                    flag = false;
                }
            });
        }
        else {
            $('#cv').remove();
        }
    }
    else if(operation === "approved"){
        $('#pdf').hide();
        $.ajax({
            type: 'POST',
            url: '/humanResources/changeApprovalState',
            data:{
                userName: userName,
                operation: operation
            },
            success: function(res) {}
        });
        $.ajax({
            type: 'POST',
            url: '/humanResources/homepage2',
            async: false,
            success: function (res) {
                window.location.assign('http://localhost:3000/humanResources/homepage')
            }
        })
    }
    else if(operation === "addTest"){
        let typeField ;
        $.ajax({
            type: 'POST',
            url: '/types/getExamTypes',
            async: false,
            success: function(res) {
                typeField = res;
                $('#types').append('<p> choose exam types  </p>');
                for (let i = 0; i < res.length; i++) {
                    $('#types').append(
                        '<div class="container"> ' +
                        '<ul> <li> <label>' + '<input type="radio"  id="type" name="type" value="' + i +  '">' + res[i].type +'</label> <ul>' +
                        '<div class="container" id="field"> </div>'+

                        '</ul> </li> </ul> ' +
                        '</div>');
                }
                $('#types').append('<input class="btn btn-primary" id="checkBoxSubmit" type="submit" value="Submit">');
            }
        });

        ///////////////////////////// Generate exam /////////////////////////////////////////////

        $("#checkBoxSubmit").click(function(){
            let fields = [];
            let questions = [];
            let index =  $("input[name='type']:checked").val();

            let type = typeField[index].type;
            for (let i = 0; i <typeField[index].field.length ; i++) {
                fields.push(typeField[index].field[i]);
            }

            for (let i = 0 ; i < fields.length ; i++ ) {
                $.ajax({
                    type: 'POST',
                    url: '/types/getQuestions',
                    async: false,
                    data:{
                        fieldName: fields[i]
                    },
                    success: function(res) {
                        if(res.length !== 0){

                            for (let j = 0 ; j < res.length  ; j++){
                                if ( j>1 ) break;
                                questions.push(res[j]);
                            }
                        }
                    }
                })
            }
            $.ajax({
                type:'POST',
                url: '/exams/generateExam',
                async: false,
                data: {
                    userName: userName,
                    questions: JSON.stringify(questions),
                    type : type
                },
                success : function (res) {
                     alert("exam has been generated");
                }
            });
            $.ajax({
                type: 'POST',
                url: '/humanResources/homepage2',
                async: false,
                success: function (res) {
                    window.location.assign('http://localhost:3000/humanResources/homepage')
                }
            })
        });
    }
    else if(operation === "disapproved"){
        $.ajax({
            type: 'POST',
            url: '/humanResources/changeApprovalState',
            data:{
                userName: userName,
                operation: operation
            },
            success: function(res) {
            }
        });
        $('#' + userName).hide();
    }
    else if(operation === "showFullTest"){
        $.ajax({
            type: 'POST',
            url: '/exams/getExams',
            data:{
                userName: userName
            },
            success: function(res) {
                let length = res.length;
                let array = res.array;
                if (length !== 0){
                    for (let i = length; i > 0; i--) {
                        $('#buttonsTests').after(
                            '<button type="submit" class="btn btn-dark btn-block" name="examType" id="' + array[i-1]._id + '"> '+ array[i-1].type + '</button>');
                    }
                }
                else {
                    alert("this candidate has no exams yet !!")
                }

            }
        });
    }
    else if(operation === "summarizedReport"){
        $.ajax({
            type: 'POST',
            url: '/exams/getExams',
            data:{
                userName: userName
            },
            success: function(res) {
                let total = 0;
                let length = res.length;
                let array = res.array;
                $("#summarizedReport").append('<h4>' + userName + '\'s summarized report </h4>');
                for (let i = 0; i < length; i++) {
                    total += array[i].score;
                    $("#summarizedReport").append('<h4> The score of test ' + array[i].type + ': ' + array[i].score + '</h4>');
                }
                $("#summarizedReport").append('<h4> The total score : ' + total + '</h4>');
                $("#summarizedReport").append('<button class="btn btn-primary" id="clearReport"> Done </button>');
            }
        });
    }

});

$(document).on('click', 'form > button', function(){
    $('#hiddenInput').val($(this).attr('id'));
});

$(document).on('click', '#clearReport',function(){
    $('#summarizedReport').html("");
});



