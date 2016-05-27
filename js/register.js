/**
 * Created by IntelliJ IDEA.
 * 作者：哔哔麻雀
 * qq: 657850227
 * Created by Administrator on 2016/5/21.
 */

window.onload = function()
{

}

function onRegister()
{
    var ajax = new MyAjax();
    var user_input = document.getElementById("username");
    var password_input = document.getElementById("password");
    var password_agin_input = document.getElementById("passwordAgin");
    var mali_input = document.getElementById("mail");

    var user_name = user_input.value;
    var password = password_input.value;
    var password_agin = password_agin_input.value;
    var mali = mali_input.value;
    var vcode = document.getElementById("verification").value;

    if(password!=password_agin)
    {
        alert("密码不一致");
        return;
    }

    var data = "action=register" + "&user_name="+user_name + "&password=" + password + "&mail=" + mali + "&vcode=" + vcode;

    ajax.post("/php/register.php",data,function(result){

        var jsonData = eval('('+result+')');
        console.log("注册返回："+jsonData);
        console.log("返回：" + jsonData["succeed"] + " " + jsonData["msg"]);
        if(jsonData["succeed"]==1)
        {
            window.location.href = "/index.html";
        }
        else
        {
            alert(jsonData["msg"]);
        }
    });

}

function refreshVerCode()
{
    var ajax = new MyAjax();
    var data = "action=vcode";
    ajax.post("/php/VerificationCode.php",data,function(result){

        document.getElementById("v-code").setAttribute("src","/php/VerificationCode.php");

    });

}
