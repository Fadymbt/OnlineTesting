$(document).ready(() => {
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
            let messages =JSON.parse(res).message;
            for (let i = 0; i <messages.length ; i++) {
                $('#messageTable').after("<tr><td class='text-center'>  " + messages[i].from +"  </td><td class='text-center'>  " +messages[i].Message + "</td></tr>")
            }
            for (let i = 0; i < length; i++) {
                $('#buttons').after('<button type="submit" class="col-md-2 btn btn-dark" id="' + array[i] + '">' + array[i] + '</button>    ' );
            }
        }
    });
});
$(document).on('click', 'form > button', function(){
    $('#hiddenInput').val($(this).attr('id'));
});
