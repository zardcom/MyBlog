<?php
    /**
     * Created by IntelliJ IDEA.
     * User: 哔哔的麻雀
     * QQ:   657850227
     * Date: 2016/4/19
     * Time: 21:45
     */

    header("Content-type: text/html; charset=utf-8");
    include "dbConenct.php";
    include "checkLogin.php";


    receiveAction();

    function receiveAction()
    {
        if(!isset($_POST["action"]))
            return;

        switch($_POST["action"])
        {
            case "publish":
                publishTopic();
                break;
            case "topicList":
                sendTopicList();
                break;
            case "get_page":
                sendPageData();
                break;
            case "get_topic_page":
                sendTopicData();
                break;
            case "reply_topic":
                replyTopic();
                break;
            case "post_reply_list":
                postReplyList();
                break;
            case "website_info":
                getWebSiteInfo();
                break;
            case "get_user_info":
                getUserInfo($_POST["user_name"]);
                break;
            default:
                break;
        }
    }



    function publishTopic()//发布文章
    {

        if(isLogin()==true)
        {

            if(isset($_SESSION["topic_time"]))
            {
                if(time() - $_SESSION["topic_time"] < 60)
                {
                    $arr = array();
                    $arr["succeed"] = 0;
                    $arr["msg"] = "1分钟内能发一文章";
                    $jsonData = json_encode($arr);
                    echo $jsonData;
                    return;
                }
            }

            $topic_title = $_POST["title"];//文章标题
            $topic_content = $_POST["content"];//文章内容
            $topic_author = $_SESSION["userInfo"]["userName"];


            $topic_user_id =  getUserIdByName($topic_author);

            $addTopicQuery = "insert into topic (user_id,topic_title,topic_author,topic_content,publish_time,reply_time) values ('$topic_user_id','$topic_title',
            '$topic_author','$topic_content',now(),now())";

            $result = mysql_query($addTopicQuery);
            $arr = array();
            if($result)
            {
                $arr["succeed"] = 1;
                $arr["msg"] = "发布文章成功";
                $_SESSION["topic_time"] = time();
            }
            else
            {

                $arr["succeed"] = 0;
                $arr["msg"] = "错误:".mysql_error();
            }
            echo json_encode($arr);
        }
        else
        {
            $arr = array();
            $arr["succeed"] = 0;
            $arr["msg"] = "请先登录";
            echo json_encode($arr);
        }

    }


    function sendTopicList()//发送文章数据
    {
        //发送文章数据

            $getTopicQuery = "select * from topic order by topic_id desc limit 0,7";
            $result = mysql_query($getTopicQuery);
            $topicList = array();
            while($row = mysql_fetch_assoc($result))
            {

                $topic_title[] = $row;
            }
            $js =  json_encode($topic_title);
            echo $js;
    }


    //响应，翻页请求
    function sendPageData()
    {



        //当前页
        $current_page = $_POST["page"];

        if($current_page<1)
        {
            $current_page=1;
        }


        //每页文章条数
        $one_page_topic_list = 12;

        //数据库文章最大条数
        $topic_list_max = 0;

        $count_result = mysql_query("select count(*) from topic");
        if($rs = mysql_fetch_array($count_result))
        {
            $topic_list_max =  $rs[0];
        }


        //最大页数
        $page_num_max = ceil($topic_list_max/$one_page_topic_list);

        if($current_page > $page_num_max)
        {
            $current_page = $page_num_max;
        }

        //当前页在数据库开始的索引
        $pageIndex = $one_page_topic_list*($current_page-1);//减1是因为数据库索引从0开始


        if($topic_list_max < $one_page_topic_list)
        {
            $one_page_topic_list = $topic_list_max;
        }


        $getPageQuery = "select * from topic order by topic_id desc limit {$pageIndex},{$one_page_topic_list}";

        $result = mysql_query($getPageQuery);
        $topic_data_list = array();
        while($row = mysql_fetch_assoc($result))
        {

            $reply_time = $row["reply_time"];
            $row["reply_time"] = timeChange($reply_time);
            $row["user_head"] = getUserHeadImgName($row["topic_author"]);
            $topic_data_list[] = $row;

        }

        $obj = new stdClass();
        $obj->page_num_max = $page_num_max;
        $obj->topic_data_list = $topic_data_list;

        echo json_encode($obj);
    }


    //发送文章数据
    function sendTopicData()
    {

            $topicId = $_POST["topic_id"];

            $sqlTopic = "select * from topic where topic_id={$topicId}";

            $result = mysql_query($sqlTopic);
            if($result)
            {
                $row = mysql_fetch_assoc($result);
                $row["publish_time"] = timeChange($row["publish_time"]);
                $row["user_head"] = getUserHeadImgName($row["topic_author"]);
                echo json_encode($row);
            }
    }




    //回复文章
    function replyTopic()
    {
        if(isLogin())
        {

            if(isset($_SESSION["reply_time"]))
            {
                if(time() - $_SESSION["reply_time"] < 10)
                {
                    $arr = array();
                    $arr["succeed"] = 0;
                    $arr["msg"] = "10秒内只能回复一次";
                    $jsonData = json_encode($arr);
                    echo $jsonData;
                    return;
                }
            }

            $reply_content = $_POST["reply_content"];
            $topic_id = $_POST["topic_id"];
            $user_id = $_SESSION["userInfo"]["uid"];
            $userName = $_SESSION["userInfo"]["userName"];

            $mysqlInsert = "insert into topic_reply (topic_id,reply_content,user_id,reply_time,user_name) values ('$topic_id','$reply_content','$user_id',now(),'$userName')";
            $result = mysql_query($mysqlInsert);

            $arr = array();

            if($result)
            {

                $arr["user_name"] = $userName;
                $arr["reply_content"] = $reply_content;
                $arr["user_head"] = getUserHeadImgName($userName);
                $arr["reply_time"] = "1秒前";

                $arr["succeed"] = 1;
                $arr["msg"] = "回复成功";
                DBReplyAdd($topic_id);
                DBReplyUserAdd($topic_id);
                $_SESSION["reply_time"] = time();
            }
            else
            {
                $arr["succeed"] = 0;
                $arr["msg"] = "写入数据库出错";
            }

            $jsonData = json_encode($arr);
            echo $jsonData;
        }
        else
        {
            $arr = array();
            $arr["succeed"] = 0;
            $arr["msg"] = "请先登入";
            $jsonData = json_encode($arr);
            echo $jsonData;
        }
    }


    //获取角色信息，文章列表，回复列表
    function getUserInfo($user_name)
    {
        $arrInfo = array();
        $arrInfo["succeed"] = 0;
        $arrInfo["msg"] = "数据库繁忙";
        $arrInfo["topic_list"] = array();
        $arrInfo["reply_list"] = array();

        //获取用户信息
        $sql_query = "select uid,user_name,user_email,user_date,last_login,user_head from user where user_name='$user_name'";
        $result = mysql_query($sql_query);
        $row = mysql_fetch_assoc($result);

        if($row)
        {
            $arrInfo["user_info"] = $row;
        }
        else
        {
            echo json_encode($arrInfo);
            exit;
        }

        $user_id = $row["uid"];


        //获取文章列表
        $sql_query = "select topic_id,user_id,topic_author,topic_title,publish_time,reply_time,reply_count from topic where user_id = '$user_id'";
        $result = mysql_query($sql_query);
        $topic_list = array();
        while($row = mysql_fetch_assoc($result))
        {
            $topic_list[] = $row;
        }
        $arrInfo["topic_list"] = $topic_list;

        $sql_query = "select * from topic_reply where user_id = '$user_id'";
        $result = mysql_query($sql_query);
        $reply_list = array();
        while($row = mysql_fetch_assoc($result))
        {
            $reply_list[] = $row;
        }
        $arrInfo["reply_list"] = $reply_list;


        $arrInfo["succeed"] = 1;
        $arrInfo["msg"] = "获取用户信息成功";

        echo json_encode($arrInfo);
    }



    //写入回复数量成功
    function DBReplyAdd($topic_id)
    {
        $mysql_str = "update topic set reply_count=reply_count+1 where topic_id = '$topic_id'";
        $result = mysql_query($mysql_str);
        if($result)
        {
            //成功
        }
    }

    //写入回复角色名字成功
    function DBReplyUserAdd($topic_id)
    {
        $user_name = $_SESSION["userInfo"]["userName"];
        $mysql_str = "update topic set reply_member='$user_name' where topic_id = '$topic_id'";
        $result = mysql_query($mysql_str);
        if($result)
        {
            //成功
        }
    }





    //返回回复列表数据
    function postReplyList()
    {
        $topic_id = $_POST["topic_id"];
        $sqlQuery = "select * from topic_reply where topic_id = '$topic_id'";
        $result = mysql_query($sqlQuery);
        $reply_arr = array();
        $obj = new stdClass();
        if($result)
        {
            while($row = mysql_fetch_assoc($result))
            {
                //格式化最后回复时间
                $the_time = $row["reply_time"];
                $row["reply_time"] = timeChange($the_time);
                $row["user_head"] = getUserHeadImgName($row["user_name"]);
                $reply_arr[] = $row;

            }


            $obj->succeed = 1;
            $obj->reply_list = $reply_arr;
        }
        else
        {
            $obj->succeed = 0;
        }
        echo json_encode($obj);
    }


    //最后回复时间
    function timeChange($the_time)
    {
        $now_time = date("Y-m-d H:i:s",time());
        $now_time = strtotime($now_time);
        $record_time = strtotime($the_time);
        $dur_time = $now_time - $record_time;

        switch($dur_time)
        {
            case $dur_time < 60://秒前
                return $dur_time."秒前";
                break;
            case $dur_time < 3600://分钟前
                return floor($dur_time/60)."分钟前";
                break;
            case $dur_time < 86400://小时前
                return floor($dur_time/3600)."小时前";
                break;

            case $dur_time < 259200://3天内
                return floor($dur_time/86400)."天前";
                break;

            default:
                return date("Y-m-d");
                break;
        }
        return $the_time;
    }

    function getUserHeadImgName($user_name)
    {

        $sql_select = "select user_head from user where user_name = '$user_name'";
        $result = mysql_query($sql_select);
        $head_img_name = "defual.png";
        if($user_name=="系统")
        {
            return $head_img_name;
        }

        if($result==false)
        {
            return $head_img_name;
        }
        else
        {
           $row = mysql_fetch_assoc($result);
            $head_img_name = $row["user_head"];
        }
        return $head_img_name;
    }


    //获取网站会员数量，文章数量，回复数量
    function getWebSiteInfo()
    {


        $arr = array("member_count"=>0,"topic_count"=>0,"reply_count"=>0);

        $result = mysql_query("select count(*) from user");
        if($rs = mysql_fetch_array($result))
        {
            $arr["member_count"] =  $rs[0];
        }

        $result = mysql_query("select count(*) from topic");
        if($rs = mysql_fetch_array($result))
        {
            $arr["topic_count"] =  $rs[0];
        }

        $result = mysql_query("select count(*) from topic_reply");
        if($rs = mysql_fetch_array($result))
        {
            $arr["reply_count"] =  $rs[0];
        }

        echo json_encode($arr);
    }

    function getUserIdByName($user_name)
    {
        $sql_query = "select uid from user where user_name='$user_name'";
        $result = mysql_query($sql_query);
        $row = mysql_fetch_assoc($result);
        if($row)
        {
            return $row["uid"];
        }

       return false;
    }

?>



