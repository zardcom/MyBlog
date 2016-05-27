/**
 * Created by IntelliJ IDEA.
 * 作者：哔哔麻雀
 * qq: 657850227
 * Created by Administrator on 2016/4/25.
 */


 //保存当前页面文章的数据
var gTopicJson = 0;

window.onload = function()
{

    var str = window.location.href;
    var startIndex = str.lastIndexOf("?");
    var endIndex = str.length;
    if(startIndex==-1)
    {
        alert("没有找到文章");
        return;
    }
    var strData = str.substring(startIndex+1,endIndex);
    gotoTopic(strData);
}



function gotoTopic(data)
{
    var ajaxObj = new MyAjax();
    ajaxObj.post("/php/blog.php",data,function(result)
    {

        console.log("retsult---   "+result);
        var jsData = eval('('+result+')');
        console.log("jsData--- %o",jsData);

        for(var obj in jsData)
        {
            console.log(jsData[obj]);
        }

        gTopicJson = jsData;

        var doc = document;
        doc.getElementsByClassName("info")[0].setAttribute("href","/html/userInfo.html?action=get_user_info&user_name="+jsData["topic_author"]);
        doc.getElementById("author-head-id").setAttribute("src","/img/head/"+jsData["user_head"]);
        doc.getElementById("topic-title-id").innerHTML=jsData["topic_title"];
        doc.getElementById("author-name-id").innerText=jsData["topic_author"];
        doc.getElementById("author-name-id").setAttribute("href","/html/userInfo.html?action=get_user_info&user_name="+jsData["topic_author"]);
        doc.getElementById("publish-time-id").innerText=jsData["publish_time"];
        doc.getElementById("topic-content-id").innerHTML=jsData["topic_content"];

        initRelyList(jsData["topic_id"]);

    });

}



function  initRelyList(topic_id)
{
    var ajaxObj = new MyAjax();
    var data = "action=post_reply_list&" + "topic_id="+topic_id;

    ajaxObj.post("/php/blog.php",data,function(result){
          var jsonData = eval('('+result+')');
           console.log("返回回复列表："+result);
        if(jsonData && jsonData["succeed"]==1)
        {
          console.log(jsonData["reply_list"]);

            var reply_list = jsonData["reply_list"];
            for(var key in reply_list)
            {
                createReplyItem(reply_list[key]);
            }

        }
        else
        {
            console.log("返回回复列表失败");
        }
    });
}


function  createReplyItem(itemData)
{
    var strHtml = ["                <div class=\"reply-item\" style=\"display: block;min-height:80px;height: auto;\">",
        "                    <div class=\"reply-item-head\">",
        "                        <div>",
        "                            <a class=\"reply-user-info\" href=\"#\"><img class=\"common-round-border-img\" src=\"/myblog/img/22.png\" width=\"70px\" height=\"70px\"></a>",
        "                        </div>",
        "                    </div>",
        "                    <div class=\"reply-item-content  common-box-shadow\" style=\"border-left: none;\">",
        "                        <div class=\"reply-item-box-traingle common-triangle-1\">",
        "                        </div>",
        "                        <div style=\"padding: 10px 20px 10px 20px\">",
        "                            <div class=\"reply-item-cell-1\">",
        "                                <a class=\"reply-item-name common-a-s1\" href=\"#\">xx</a>",
        "                            </div>",
        "                            <div class=\"reply-item-cell-2\">",
        "                                <p class=\"reply-item-time common-gray-charater\" >最后回复时间：22222</p>",
        "                            </div>",
        "                            <div class=\"reply-item-cell-3\" >",
        "                                啊啊啊啊啊sfasdfSDFSDFSFDSFSF啊啊啊啊啊",
        "                            </div>",
        "                        </div>",
        "                    </div>",
        "                </div>"].join("");

    var reply_list_div = document.getElementById("reply-list");
    var div = document.createElement("div");
    prependChild(reply_list_div,div);
    div.innerHTML = strHtml;

    div.getElementsByClassName("reply-user-info")[0].setAttribute("href","/html/userInfo.html?action=get_user_info&user_name="+itemData["user_name"]);
    div.getElementsByClassName("common-round-border-img")[0].setAttribute("src","/img/head/"+itemData["user_head"]);
    div.getElementsByClassName("reply-item-name")[0].innerText = itemData["user_name"];
    div.getElementsByClassName("reply-item-name")[0].setAttribute("href","/html/userInfo.html?action=get_user_info&user_name="+itemData["user_name"]);
    div.getElementsByClassName("reply-item-time")[0].innerText = itemData["reply_time"];
    div.getElementsByClassName("reply-item-cell-3")[0].innerText = itemData["reply_content"];

    console.log("头："+itemData["user_head"]);

}

function prependChild(parent,newChild)
{
    if(parent.firstChild)
    {
        parent.insertBefore(newChild,parent.firstChild);
    }
    else
    {
        parent.appendChild(newChild);
    }
    return parent;
}



function reply()
{
    var ajaxObj = new MyAjax();
    var replyStr = document.getElementById("textarea-id").value;
    var topic_id = gTopicJson["topic_id"];

    if(replyStr.length < 5)
    {
        alert("回复在5个字节以上");
        return;
    }

    var data = "action=reply_topic&" + "reply_content=" + replyStr + "&topic_id=" + topic_id;
    ajaxObj.post("/php/blog.php",data,function(result){

        var jsonData = eval('('+result+')');
        console.log("返回文章页面成功");
        console.log("返回：" + result);


        var succeed = jsonData["succeed"];
        if(succeed==1)
        {
            var reply_content = jsonData["reply_content"];
            var user_name = jsonData["user_name"];

            createReplyItem(jsonData);
            document.getElementById("textarea-id").value = "";

            alert(jsonData["msg"]);

        }
        else
        {
            alert(jsonData["msg"]);
        }

    });
}
