/**
 * Created by ${PRODUCT_NAME}.
 * User: 哔哔的麻雀
 * QQ:   657850227
 * Created by ${USER} on ${DATE}.
 */

function MyAjax()
{

};

MyAjax.prototype = {
    get:function(url,data,funSucceed)
    {
        var result;
        var xmlhttp;
        if(window.XMLHttpRequest)//其他浏览器
        {
            xmlhttp = new XMLHttpRequest();
        }
        else//巨硬浏览器
        {
            xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
        }
        xmlhttp.onreadystatechange = function()
        {

            switch (xmlhttp.readyState)
            {
                case 0:// 请求未初始化
                    console.log("0---" + xmlhttp.status);
                    break
                case 1:// 服务器连接已建立
                    console.log("1---" + xmlhttp.status);
                    break;
                case 2:// 请求已接收
                    console.log("2---" + xmlhttp.status);
                    break;
                case 3: //请求处理中
                    console.log("3---" + xmlhttp.status);
                    break;
                case 4://请求已完成，且响应已就绪
                    if( xmlhttp.status==200)
                    {
                        result = xmlhttp.responseText;
                        funSucceed(result);
                    }
                    else if( xmlhttp.status==404)
                    {
                        console.log("htttp get 页面无响应--------------   "+xmlhttp.status);
                    }
                    else  if(xmlhttp.status==204)
                    {
                        console.log("no cotent..." + xmlhttp.status);
                    }
                    else
                    {

                    }
                    console.log("4---" + xmlhttp.status);
                    break;
                default:
                    console.log("htttp get 请求失败--------------   "+xmlhttp.readyState);
                    break;
            }

        };

        xmlhttp.open('GET',url + '?' + data,true);
        xmlhttp.send();
    },
    post:function(url,data,funSucceed)
    {
        var result;
        var xmlhttp;
        if(window.XMLHttpRequest)//其他浏览器
        {
            xmlhttp = new XMLHttpRequest();
        }
        else//巨硬浏览器
        {
            xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
        }
        xmlhttp.onreadystatechange = function()
        {
            switch (xmlhttp.readyState)
            {
                case 0:// 请求未初始化
                    break
                case 1:// 服务器连接已建立
                    break;
                case 2:// 请求已接收
                    break;
                case 3: //请求处理中
                    break;
                case 4://请求已完成，且响应已就绪
                    if( xmlhttp.status==200)
                    {
                        result = xmlhttp.responseText;
                        funSucceed(result);
                    }
                    else if( xmlhttp.status==404)
                    {
                        console.log("htttp post 页面无响应--------------   "+xmlhttp.status);
                    }
                    else
                    {

                    }
                    break;
                default:
                    console.log("htttp post 请求失败--------------   "+xmlhttp.readyState);
                    break;
            }
        };


        console.log("post---url--"+url);
        console.log("post---data--"+data);

        xmlhttp.open('POST',url,true);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlhttp.send(data);
    }

};
