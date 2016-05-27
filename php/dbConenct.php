<?php
    /**
     * Created by IntelliJ IDEA.
     * User: 哔哔的麻雀
     * QQ:   657850227
     * Date: 2016/4/20
     * Time: 0:09
     */

    define('DB_HOST',"localhost");
    define('DB_USER',"root");
    define('DB_PASSWORD',"root");

    $conn = mysql_connect(DB_HOST,DB_USER,DB_PASSWORD);
    mysql_select_db('shequ');
    mysql_query('set names utf8');




    //检查用户名是否符合规定 (两个字符以上，字母，数字，下划线的)
    function is_username($user_name)
    {
     //   $str = "/^[a-zA-Z0-9_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]+$/";
        $str = "/^[\w-\.]{2,16}$/";
        if(!preg_match($str, $user_name))
        {
            return false;
        }
        return true;
    }

    //数字字母下划线，中划线，点，6--16位
    function is_password($user_password)
    {

        if(!preg_match("/^[\w-\.]{6,16}$/",$user_password))
        {
            return false;
        }
        return true;
    }

    //检测邮箱是否合法
    function is_mail($mail)
    {
        $pattern = "/^([0-9A-Za-z\\-_\\.]+)@([0-9a-z]+\\.[a-z]{2,3}(\\.[a-z]{2})?)$/i";
        if (!preg_match($pattern,$mail))
        {
            return false;
        }
        return true;
    }

?>