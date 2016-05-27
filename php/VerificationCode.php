<?php
    /**
     * Created by IntelliJ IDEA.
     * User: 哔哔麻雀
     * QQ:   657850227
     * Date: 2016/5/24
     * Time: 23:08
     */

    session_start();

    @ header("Content-Type:image/png");

    $strCode = getRandStr();
    $_SESSION["vcode"] = $strCode;

    getVCode($strCode,80,35);


    function getRandStr()
    {
        $str = "abcdefghkmnprstuvwxyzABCDEFGHKMNPRSTUVWXYZ23456789";
        $_len = strlen($str)-1;
        $code = "";
        for ($i=0;$i<4;$i++)
        {
            $code .= $str[mt_rand(0, $_len)];
        }
        return $code;
    }

    function getVCode($codeStr,$img_with,$img_height)
    {
        $img = imagecreate($img_with,$img_height);
        $back = imagecolorallocate($img, 255, 255, 255);
        $font_color = imagecolorallocate($img, 41, 163, 238);
        imagestring($img,10,20,10,$codeStr,$font_color);
        imagerectangle($img, 0, 0, $img_with -1, $img_height -1, $font_color);
        imagepng($img);
        imagedestroy($img);
    }


?>