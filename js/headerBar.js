/**
 * Created by IntelliJ IDEA.
 * 作者：哔哔麻雀
 * qq: 657850227
 * Created by Administrator on 2016/5/4.
 */

window.onload = function()
{
    console.log("headerBar....");
}

//登录请求
function login()
{
    var ajaxObj = new MyAjax();
    var userNameStr = "&username=" + document.getElementById("username").value;
    var passwordStr = "&password=" + document.getElementById("password").value;
    var data = "action=login" + userNameStr + passwordStr;
    ajaxObj.post("/php/login.php",data,function(result){

        var jsonData = eval('('+result+')');
        console.log(result);
        console.log(jsonData);

        if(jsonData["state"]==1)
        {
            window.location.href = "../test.html";
        }
        else
        {
            alert("用户名或密码出错");
        }
    });
}

//退出登录
function outLogin()
{
    var ajaxObj = new MyAjax();
    var data = "action=outLogin";
    ajaxObj.post("../php/login.php",data,function(result){

        var jsonData = eval('('+result+')');
        console.log(result);
        console.log(jsonData);

        if(jsonData["state"]==1)
        {
            window.location.href = "../test.html";
        }
        else
        {
            alert("用户名或密码出错");
        }
    });
}

