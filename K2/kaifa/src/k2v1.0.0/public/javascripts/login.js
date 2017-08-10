/**
 * Created by #赵堃圻# on 2017/6/14.
 */
$(function () {
    verfication();

})

$("#login-button").click(function () {
    var uname = $("#user_id").val();
    var password = $("#user_password").val();
    var verNum=$("#verCode").val().toUpperCase();
    var code=$("#verPhoto").val().toUpperCase();

    if (uname == "" || uname == null) {
        alert("用户名不能为空");
        return false;
    } else if (password == "" || password == null) {
        alert("密码不能为空");
        return false;
    }else if (verNum==""||verNum==null){
        alert("验证码不能为空");
        return false;
    }else if(verNum!=code){
        console.log(code);
        console.log(verNum)
        alert("验证码错误");
        return false;
    }

    $.ajax({
        url: '/login',
        type: 'POST',
        dataType: "json",
        data: {
            'uname': $('#user_id').val(),
            'password': $('#user_password').val()
        },

        beforeSend:function () {

            $("#wait").css({"display":"block"})
        },

        success: function (data) {

            if (data.status == 0) {
           
                window.location.href = "/home"
            } else if (data.status == 1) {
                alert("密码错误");
                return false;
            } else if (data.status == 2) {
                alert("账号不存在");

                return false;
            } else if (data.status == 3) {
                alert("系统错误");
            } else if(data.status==4){
                alert("账号已被禁用");
            }
        },

        complete:function () {

            $('#wait').css({"display":"none"})
        }

    });


});

$("#verPhoto").click(function () {

    verfication();
})


function verfication() {
    var codeChars=new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t',
        'u','v','w','x','y','z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
        'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z')

    var code="";
    for(var i=0;i<4;i++){
        var charNum=Math.floor(Math.random()*62);
        code=code+codeChars[charNum]
    }
    document.getElementById("verPhoto").value=code;



}

