$(document).ready(() =>{
    $('#email').keyup(() => {
        let userName = $('#userName').val();
        $.ajax({
            type: 'POST',
            url: '/candidates/checkUserName',
            data:{
                userName: userName
            },
            success: function (res) {
                if (res.toString() === 'taken')
                {
                    $('#taken').html('<p id= \'paragraph\' class=\"alert alert-danger\"> UserName already exists </p>')
                    $('#userName').val("")
                }
                else if (res.toString() === 'notTaken') {
                    $('#paragraph').hide()
                }
                else {
                    alert(res.toString())
                }
            }

        })
    });
});

$(document).ready(() =>{
    $('#cv').focus(function () {
        let password = $('#password').val();
        let password2 = $('#password2').val();
        if(password !== password2){
            $('#showResponse').html('<p id= \'paragraph2\' class=\"alert alert-danger\"> Passwords do not match </p>');
            $('#password2').val("")
        }
        if(password === password2){
            $('#paragraph2').hide()
        }

    })
});
