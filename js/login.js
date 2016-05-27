/**
 * Created by IntelliJ IDEA.
 * User: 哔哔的麻雀
 * QQ:   657850227
 * Date: 2016/5/3
 */


//登入请求
function login()
{
    var ajaxObj = new MyAjax();
    var username =document.getElementById("username").value;
    var password = document.getElementById("password").value;

    var usernameStr = "&username="+username;
    var passwordStr = "&password="+password;
    var data = "action=login" + usernameStr + passwordStr;

    ajaxObj.post("/php/login.php",data,function(result){

        console.log("登入返回：" + result);
        var jsonData = eval('('+result+')');
        console.log("登入返回："+jsonData);
        var succeed = jsonData["succeed"];

        if(succeed==1)//登入成功
        {
            console.log(jsonData["succeed"]+": 登入成功");
           // window.history.back();
            window.location.href = "/index.html";
        }
        else
        {
            alert(jsonData["msg"]);
        }
    });
}




//检测登入
function  checkLogin()
{
    var ajaxObj = new MyAjax();
    var data = "action=checkLogin";

    ajaxObj.post("/php/login.php",data,function(result){

        var jsonData = eval('('+result+')');

        console.log("登入返回："+jsonData);

        var state = jsonData["state"];
        var doc = document;
        if(state==1)//已经登入过
        {
            //更新头部登入显示
            doc.getElementById("no-login").style.display="none";
            doc.getElementById("is-login").style.display="block";
            doc.getElementById("userLoginName").innerHTML = jsonData["userName"];
            doc.getElementById("userLoginName").setAttribute("href","/html/userCenter.html?action=get_user_info&user_name="+jsonData["userName"]);
            console.log("已经登入过："+jsonData["state"]);


            //更新右面板
            updateRightPanel(true);
            updateReplyBox(true);

        }
        else//没有登入
        {
            doc.getElementById("no-login").style.display="block";
            doc.getElementById("is-login").style.display="none";
            console.log("还没有登入："+jsonData["state"]);

            //更新右面板
            updateRightPanel(false);
            updateReplyBox(false);
        }

    });
}

//更新右面板
function updateRightPanel(isShow)
{
    var doc = document;
    var rightPanel = doc.getElementById("right-panel");

    if(rightPanel==null)
        return;

    if(isShow)
    {
        doc.getElementById("publish-topic").style.display="block";
    }
    else
    {
        doc.getElementById("publish-topic").style.display="none";
    }
}

//更新用户回复功能
function updateReplyBox(isShow)
{
    var replyBox = document.getElementById("reply-box");
    if(replyBox==null)
    return;

    if(isShow)
    {
        replyBox.style.display="block";
    }
    else
    {
        replyBox.style.display="none";
    }

}


//用户中心
function userCenter()
{

}

//退出登入
function  outLogin()
{
    var ajaxObj = new MyAjax();
    var data = "action=outLogin";

    ajaxObj.post("/php/login.php",data,function(result){

        var jsonData = eval('('+result+')');
        var succeed = jsonData["succeed"];
        console.log("登入返回："+succeed);


        if(succeed==1)//退出登入成功
        {
            document.getElementById("no-login").style.display="block";
            document.getElementById("is-login").style.display="none";
            console.log("用户注销成功："+jsonData["succeed"]);

            //更新右面板
            updateRightPanel(false);
        }
    });
}


