<?php
    /**
     * Created by IntelliJ IDEA.
     * User: 哔哔的麻雀
     * QQ:   657850227
     * Date: 2016/4/19
     * Time: 23:23
     */



    session_start();
    header("Content-type: text/html; charset=utf-8");


    include_once "dbConenct.php";

    checkLogin();


    /**
     * 验证登录提交信息
     */
    function checkLogin()
    {

        if(isset($_POST["action"]))
        {
            $action = $_POST["action"];
            switch($action)
            {
                case "login":
                    login();
                    break;
                case "checkLogin":
                    check();
                    break;
                case "outLogin":
                    outLogin();
                    break;
                default:
                    exit("未知请求");
                    break;
            }

        }
    }



    function login()
    {

        $userName = $_POST["username"];
        $password = $_POST["password"];

        if (is_username($userName) == false)
        {
            $arr = array();
            $arr["succeed"] = 0;
            $arr["msg"] = "用户名只能是两个字符以上，只能有字母，数字，下划线的";
            echo json_encode($arr);
            return;
        }

        if (is_password($password)==false)
        {
            $arr = array();
            $arr["succeed"] = 0;
            $arr["msg"] = "密码只能是数字字母下划线，中划线，点，6--16位";
            echo json_encode($arr);
            return;
        }



        $check_query = "select * from user where user_name='$userName'";
        $result = mysql_query($check_query);
        $row = mysql_fetch_assoc($result);


        if($row!=false)//存在该用户
        {

            if($password == $row["user_password"])
            {
               // echo "登录成功";
                setcookie(session_name(),session_id(),time()+60*60*24*7,"/");//设置session id的在cookie的时间
                $user_info = array();
                $user_info["userName"] = $row["user_name"];
                $user_info["uid"] = $row["uid"];
                $_SESSION["userInfo"] = $user_info;

                $arr = $_SESSION["userInfo"];
                $arr["succeed"]=1;
                $arr["msg"] = "登入成功";
                $jsInfo = json_encode($arr);
                echo $jsInfo;
            }
            else
            {
                $arr = array();
                $arr["succeed"]=0;
                $arr["msg"] = "密码或用户名不对";
                $jsonData = json_encode($arr);
                echo $jsonData;
            }
        }
        else//不存在
        {
            $arr = array();
            $arr["succeed"]=0;
            $arr["msg"] = "密码或用户名不对";
            $jsonData = json_encode($arr);
            echo $jsonData;
        }

    }

    function check()
    {
        if(isset($_SESSION["userInfo"]))
        {
            $arr = $_SESSION["userInfo"];

            writeLastLoginTime($_SESSION["userInfo"]["uid"]);

            $arr["state"] = 1;
            $jsInfo = json_encode($arr);
            echo $jsInfo;
        }
        else
        {
            $arr = array('state'=>'0');
            $jsInfo = json_encode($arr);
            echo $jsInfo;
        }
    }

    //记录成员最后登入时间
    function writeLastLoginTime($user_id)
    {
        $uid = $user_id;
        $sql_query = "update user set last_login = now() where uid= '$uid'";
        $result = mysql_query($sql_query);

    }


    //注销
    function outLogin()
    {
        if(isset($_SESSION["userInfo"]))
        {
            $_SESSION = array();
            if(isset($_COOKIE[session_name()]))
            {
                setcookie(session_name(),'',time()-3600);
            }
            session_destroy();
            $arr = array("succeed"=>"1");
            $jsInfo = json_encode($arr);
            echo $jsInfo;
        }
        else
        {
            $arr = array("succeed"=>"2");
            $arr["msg"] = "已经注销过了";
            $jsInfo = json_encode($arr);
            echo $jsInfo;
        }
    }

?>