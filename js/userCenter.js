/**
 * Created by IntelliJ IDEA.
 * 作者：哔哔麻雀
 * qq: 657850227
 * Created by Administrator on 2016/5/16.
 */
window.onload = function()
{
    var str = window.location.href;
    var startIndex = str.lastIndexOf("?");
    var endIndex = str.length;
    if(startIndex==-1)
    {
        alert("没找到该成员");
        return;
    }
    var strData = str.substring(startIndex+1,endIndex);



    getUserData(strData);
}


function getUserData(data)
{
    var ajax = new MyAjax();
    ajax.post("/php/blog.php",data,function(result){

        console.log("用户result: " + result);
        var jsonData = eval('(' + result + ')');
        console.log("用户信息：" + jsonData);
        var succeed = jsonData["succeed"];


        if(succeed==1)
        {
            var user_info = jsonData["user_info"];
            var topic_list = jsonData["topic_list"];
            var reply_list = jsonData["reply_list"];

            initUserInfo(user_info,topic_list.length,reply_list.length);
            initTopicList(topic_list);
            initReplyList(reply_list);
        }
        else
        {
            alert(jsonData["msg"]);
        }

    });
}



function initUserInfo(user_info,topic_num,reply_num)
{
    document.getElementById("user-info1").setAttribute("src","/img/head/" + user_info["user_head"]);
    document.getElementById("user-info2").innerText = user_info["user_name"];
    document.getElementById("user-info3").innerText = "注册日期：" +  user_info["user_date"];
    document.getElementById("user-info4").innerText = "文章数量：" + topic_num;
    document.getElementById("user-info5").innerText = "回复数量：" + reply_num;
    document.getElementById("user-info6").innerText = "最近登入：" + user_info["last_login"];

}

function initTopicList(topic_list)
{

    var strTopic = ["<a class=\"common-a-s1\" style=\"cursor: pointer;\">文章管理 等待下个版本实现</a>"].join("");
    var ul_elem = document.getElementById("cell-1");
    for(var key in topic_list)
    {
        var li_elem = document.createElement("li");
        li_elem.innerHTML = strTopic;
        li_elem.getElementsByTagName("a")[0].innerText = topic_list[key]["topic_title"] + "    " + topic_list[key]["publish_time"];
        li_elem.getElementsByTagName("a")[0].setAttribute("href","/html/topic.html?action=get_topic_page&topic_id="+topic_list[key]["topic_id"]);
        ul_elem.appendChild(li_elem);
    }
}

function initReplyList(reply_list)
{
    var strTopic = ["<div class=\"common-black-charater\">回复管理 等待下个版本实现</div>"].join("");
    var ul_elem = document.getElementById("cell-2");
    for(var key in reply_list)
    {
        var li_elem = document.createElement("li");
        li_elem.innerHTML = strTopic;
        li_elem.getElementsByTagName("div")[0].innerText = reply_list[key]["reply_content"] +"    "+ reply_list[key]["reply_time"];
        ul_elem.appendChild(li_elem);
    }
}




function onTabClick(index)
{
    var tab_menu = document.getElementById("tab-menu");
    var li_list = tab_menu.getElementsByTagName("li");
    var curr_tab_id = "tab-" + index;

    for(var i = 0; i < li_list.length; i++)
    {
        var curr_tab = li_list[i];
        if(curr_tab["id"]==curr_tab_id)
        {
            curr_tab.setAttribute("class","common-tab-btn common-tab-btn-active");
        }
        else
        {
            curr_tab.setAttribute("class","common-tab-btn");
        }
    }


    switch (index)
    {
        case 0:
            showUserInfo();
            break;
        case 1:
            showTopicList();
            break;
        case 2:
            showReplyList();
            break;
        default:
            showUserInfo();
            break;
    }
}



function showUserInfo()
{
    document.getElementById("user-info").style.display = "block";
    document.getElementById("topic-list").style.display = "none";
    document.getElementById("reply-list").style.display = "none";
}

function showTopicList()
{
    document.getElementById("user-info").style.display = "none";
    document.getElementById("topic-list").style.display = "block";
    document.getElementById("reply-list").style.display = "none";
}

function showReplyList()
{
    document.getElementById("user-info").style.display = "none";
    document.getElementById("topic-list").style.display = "none";
    document.getElementById("reply-list").style.display = "block";
}




function UpladFile()
{
    var fileObj = document.getElementById("file-id").files[0];

    if(fileObj==null)
    return;

    var form = new FormData();
    form.append("upfile", fileObj);

    var ajaxFile = new AjaxFile();
    ajaxFile.post("/php/uploadHeadImg.php",form,function(result){

        console.log("头像上传返回："+result);
        var randNum = Math.random(1,10000);
        document.getElementById("user-info1").setAttribute("src","/img/head/"+result + "?&rand="+randNum);

    });

}

