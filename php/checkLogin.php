<?php
    /**
     * Created by IntelliJ IDEA.
     * User: 哔哔麻雀
     * QQ:   657850227
     * Date: 2016/5/3
     * Time: 1:36
     */

    session_start();

    function isLogin()
    {
        if(isset($_SESSION["userInfo"]))
        {
          return true;
        }
        return false;
    }
?>