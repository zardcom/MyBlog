<?php
    /**
     * Created by IntelliJ IDEA.
     * User: 哔哔麻雀
     * QQ:   657850227
     * Date: 2016/5/2
     * Time: 21:23
     */
    session_start();
    header("Content-type: text/html; charset=utf-8");
    include "dbConenct.php";


    onReginster();

    function onReginster()
    {
        if(isset($_POST["action"]) && $_POST["action"] == "register")
        {

            $userName = $_POST["user_name"];
            $passWord = $_POST["password"];
            $emil = $_POST["mail"];
            $vcode = $_POST["vcode"];

            if($_SESSION["vcode"]!=$vcode)
            {

                $arr = array();
                $arr["succeed"] = 0;
                $arr["msg"] = "验证码不对".$_SESSION["vcode"];
                echo json_encode($arr);
                return;
            }


            if (is_username($userName) == false)
            {
                $arr = array();
                $arr["succeed"] = 0;
                $arr["msg"] = "用户名只2个能数字字母下划线，中文，中划线，点，6--16位";//"用户名只能是两个字符以上，只能有字母，中文 数字，下划线的";
                echo json_encode($arr);
                return;
            }

            if (is_password($passWord)==false)
            {
                $arr = array();
                $arr["succeed"] = 0;
                $arr["msg"] = "密码只能是数字字母下划线，中划线，点，6--16位";
                echo json_encode($arr);
                return;
            }


            $check_query = "select uid from user where user_name='$userName' limit 1";
            $result = mysql_query($check_query);

            if(mysql_fetch_assoc($result))
            {
                $arr = array();
                $arr["succeed"] = 0;
                $arr["msg"] = $userName."用户名已经存在";
                echo json_encode($arr);
            }
            else
            {

                $user_head = "head".rand(0,17).".jpg";

                $inser_query = "insert into user(user_name,user_password,user_email,user_date,user_head) values('$userName',
                '$passWord','$emil',now(),'$user_head')";

                $insertResult = mysql_query($inser_query);
                if($insertResult)
                {
                    $arr = array();
                    $arr["succeed"] = 1;
                    $arr["msg"] = "注册成功";

                    $uid = select_uid_by_name($userName);
                    if($uid=="error")
                    {
                        echo "失败。。。。";
                    }

                    setcookie(session_name(),session_id(),time()+60*12,"/");//设置session id的在cookie的时间
                    $user_info = array();
                    $user_info["userName"] = $userName;
                    $user_info["uid"] = $uid;
                    $_SESSION["userInfo"] = $user_info;

                    echo json_encode($arr);
                }
                else
                {
                    $arr = array();
                    $arr["succeed"] = 0;
                    $arr["msg"] = "数据库繁忙".mysql_error();
                    echo json_encode($arr);
                }
            }

        }
    }



    function select_uid_by_name($user_name)
    {
        $sql_query = "select uid from user where user_name='$user_name'";
        $result = mysql_query($sql_query);
        if($result)
        {
            $row = mysql_fetch_assoc($result);
            return $row["uid"];
        }

        return "error";
    }



?>