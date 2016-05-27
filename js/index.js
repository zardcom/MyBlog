
window.onload = function() {

    gotoPage(1);
    getWebSiteInfo();
}


function  createArticleItem(topicData)
{

    var topic_id = topicData["topic_id"];//文章id
    var topic_title = topicData["topic_title"];//文章标题
    var topic_author = topicData["topic_author"];//作者
    //var topic_content = topicData["topic_content"];//文章内容
    var publish_time = topicData["publish_time"];//文章发布时间
    var reply_count = topicData["reply_count"];//回复数量
    var topic_reply_time = topicData["reply_time"];//最后回复时间
    var reply_member = topicData["reply_member"];//最后回复的人
    var user_head = topicData["user_head"];//头像名称


    var doc = document;
    var content = doc.getElementById("topic-box");

    var topicStr =["                        <div class=\"topic-item\">",
        "                            <div class=\"topic-item-user-head\">",
        "                                <a  class=\"info\" href=\"#\"><img class=\"common-round-img\" src=\"img/head/head0.jpg\" width=\"48px\" height=\"48px\"></a>",
        "                            </div>",
        "                            <div class=\"topic-item-body\">",
        "                                <div class=\"div-a-s1\"><a href=\"#\">我是文章标题-第一章</a></div>",
        "                                <div class=\"topic-item-info\">",
        "                                    <div class=\"info1\"><a class=\"common-a-s2\" href=\"#\">作者</a></div>",
        "                                    <div class=\"info5 common-gray-charater\"><p>2005-22-1</p></div>",
        "                                    <div class=\"info2 common-gray-charater\"><p> . 10分钟前 . 最后回复来自 . </p></div>",
        "                                    <div class=\"info3\"><a class=\"common-a-s2\" href=\"#\">回复者</a></div>",
        "                                </div>",
        "                            </div>",
        "                            <div class=\"topic-item-reply-num\">",
        "                                <p class=\"info4\">11</p>",
        "                            </div>",
        "                        </div>"].join("");


    var div = doc.createElement("div");
    div.innerHTML = topicStr;
    content.appendChild(div);

    var titleElement = div.getElementsByClassName("div-a-s1")[0].getElementsByTagName("a")[0];
    titleElement.innerText = topic_title;
    titleElement.setAttribute("href","/html/topic.html?action=get_topic_page&topic_id="+topic_id);

    var author_elem = div.getElementsByClassName("info1")[0].getElementsByTagName("a")[0];
    author_elem.innerText =topic_author;
    author_elem.setAttribute("href","/html/userInfo.html?action=get_user_info&user_name="+topic_author);


    var head_elem = div.getElementsByClassName("info")[0];
    head_elem.setAttribute("href","/html/userInfo.html?action=get_user_info&user_name="+topic_author);
    div.getElementsByClassName("common-round-img")[0].setAttribute("src","/img/head/"+user_head);

    div.getElementsByClassName("info5")[0].getElementsByTagName("p")[0].innerText = publish_time;

    if(reply_count <=0 )
    {
        div.getElementsByClassName("info2")[0].style.display = "none";
        div.getElementsByClassName("info3")[0].style.display = "none";
    }
    else
    {
        div.getElementsByClassName("info2")[0].getElementsByTagName("p")[0].innerText= " .于" + topic_reply_time + " .最后回复来自于. ";
        var reply_user_elem =  div.getElementsByClassName("info3")[0].getElementsByTagName("a")[0];
        reply_user_elem.innerText = reply_member;
        reply_user_elem.setAttribute("href","/html/userInfo.html?action=get_user_info&user_name="+reply_member);
    }



    div.getElementsByClassName("info4")[0].innerText= reply_count;
}

function  gotoPage(page)
{
    console.log("跳转到: "+ page);
    var myAjaxObj = new MyAjax();
    var data = "action=get_page" +"&page="+page + "";
    console.log("发送数据：" + data);
    myAjaxObj.post("/php/blog.php",data,function(pageData)
    {

        var doc = document;
        var content = doc.getElementById("topic-box");
        content.innerHTML = "";//清空文章区域的所以内容

        var jsData = eval('('+pageData+')');
        var topic_data_list = jsData["topic_data_list"];
        var page_num_max = jsData["page_num_max"];

        console.log("---- page_num_max  " + page_num_max);
        console.log("----pageList   " + topic_data_list);

        for(var key in topic_data_list)
        {
            createArticleItem(topic_data_list[key]);
        }

        updatePageBarxxxx(page,9,page_num_max);
    });
}




//更新翻页条
function updatePageBarxxxx(currentPage,page_btn_num,pageNumMax)
{

    if(currentPage>pageNumMax)
        currentPage=pageNumMax;
    if(currentPage<0)
        currentPage=1;

    var page_bar = document.getElementById("page-bar");

    page_bar.innerHTML = "";
    var half_page_btn_num = Math.floor(page_btn_num/2);//分页中间


    if (pageNumMax <= page_btn_num)//第一种情况，数据库分页数量小于要显示的最大的分页按钮数量
    {
        for(var i = 1; i <= pageNumMax; i++)
        {
            var page_btn = document.createElement("a");
            page_bar.appendChild(page_btn);

            if(i==currentPage)
            {
                page_btn.setAttribute("class","common-page-btn common-page-btn-active");
            }
            else
            {
                page_btn.setAttribute("class","common-page-btn");
                page_btn.setAttribute("href","javascript:gotoPage(" + i + ")");
            }
            page_btn.innerText = i;
        }
    }
    else
    {

        if(currentPage <= half_page_btn_num)
        {
            for(var i = 1; i <= page_btn_num; i++)
            {
                var page_btn = document.createElement("a");
                page_bar.appendChild(page_btn);

                if(i==currentPage)
                {
                    page_btn.setAttribute("class","common-page-btn common-page-btn-active");
                }
                else
                {
                    page_btn.setAttribute("class","common-page-btn");
                    page_btn.setAttribute("href","javascript:gotoPage(" + i + ")");
                }
                page_btn.innerText = i;
            }
            return;
        }

        if(currentPage >= pageNumMax - half_page_btn_num)
        {
            for(var i = pageNumMax-(page_btn_num-1); i <= pageNumMax; i++)
            {
                var page_btn = document.createElement("a");
                page_bar.appendChild(page_btn);

                if(i==currentPage)
                {
                    page_btn.setAttribute("class","common-page-btn common-page-btn-active");
                }
                else
                {
                    page_btn.setAttribute("class","common-page-btn");
                    page_btn.setAttribute("href","javascript:gotoPage(" + i + ")");
                }
                page_btn.innerText = i;
            }
            return;
        }


        var startPage = currentPage - half_page_btn_num;
        var endPage = currentPage + half_page_btn_num;

        if(startPage < 1)
        {
            startPage = 1;
        }

        if(endPage > pageNumMax)
        {
            endPage = pageNumMax;
        }


        for(var page = startPage; page <= endPage; page++)
        {
            var page_btn = document.createElement("a");
            page_bar.appendChild(page_btn);

            if(page==currentPage)
            {
                page_btn.setAttribute("class","common-page-btn common-page-btn-active");
            }
            else
            {
                page_btn.setAttribute("class","common-page-btn");
                page_btn.setAttribute("href","javascript:gotoPage(" + page + ")");
            }
            page_btn.innerText = page;
        }
    }

}



//获取网站信息
function getWebSiteInfo()
{
    var myAjaxObj = new MyAjax();
    var data = "action=website_info";
    myAjaxObj.post("/php/blog.php",data,function(result)
    {

        //var doc = document;
        //var content = doc.getElementById("topic-box");
        //content.innerHTML = "";//清空文章区域的所以内容

        var jsData = eval('('+result+')');
        console.log("返回网站信息：" + result);
        console.log("返回网站信息：" + jsData["member_count"]);
        console.log("返回网站信息：" + jsData["topic_count"]);
        console.log("返回网站信息：" + jsData["reply_count"]);

        var website_info_div = document.getElementById("website-info");
        if(website_info_div)
        {
            document.getElementById("member-count").innerText="会员数量:" + jsData["member_count"];
            document.getElementById("topic-count").innerText="文章数量:" + jsData["topic_count"];
            document.getElementById("reply-count").innerText="回复条数:" + jsData["reply_count"];

        }

    });
}

//查看用户信息
function onUserInfo(user_name)
{

}


function getParam(paramName)
{
    var paramValue = "";
    var isFound = false;
    if (this.location.search.indexOf("?") == 0 && this.location.search.indexOf("=") > 1)
    {
        var arrSource = unescape(this.location.search).substring(1, this.location.search.length).split("&");

        var i = 0;
        while (i < arrSource.length && !isFound)
        {
            if (arrSource[i].indexOf("=") > 0)
            {
                if (arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase())
                {
                    paramValue = arrSource[i].split("=")[1];
                    isFound = true;
                }
            }
            i++;
        }
    }
    return paramValue;
}