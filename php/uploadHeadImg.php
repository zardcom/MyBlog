<?php
    /**
     * Created by IntelliJ IDEA.
     * User: 哔哔麻雀
     * QQ:   657850227
     * Date: 2016/5/17
     * Time: 21:50
     */

    header("Content-type: text/html; charset=utf-8");
    include_once "dbConenct.php";
    include_once "checkLogin.php";

    upLoadHeadImg();

   // testUpoad();

    function testUpoad()
    {
        if(isset($_FILES["myfile"]))
        {
            $str = $_FILES["myfile"]["tmp_name"];
            $str2 =  $_FILES["myfile"]["name"];
            echo $str2;
        }
        else
        {
            echo "no file....";
        }

    }

    function upLoadHeadImg()
    {

        if(isLogin()==false)
        {
            echo "请登入。。。。";
            exit;
        }

        //判断图片是否纯在
        if(!is_uploaded_file($_FILES["upfile"]["tmp_name"]))
        {
            echo "图片不存在";
            exit;
        }


        if(!isset($_SESSION["userInfo"]) && !isset($_SESSION["userInfo"]["userName"]))
        {
            echo "用户名不存在。。。";
            exit;
        }


        if($_SERVER["REQUEST_METHOD"] != "POST")
            return;


        $head_img_floder = "../img/head";
        $img_save_path = "../img/head/";

        $img_type = array( 'image/jpg',
            'image/jpeg',
            'image/png',
            'image/pjpeg',
            'image/gif',
            'image/bmp',
            'image/x-png');

        $img_file_max_size = 307200;//限制在300kb




        $file_img = $_FILES["upfile"];

        //检查文件大小
        if($img_file_max_size <= $file_img["size"])
        {
            echo "文件不能超过300kb!";
            exit;
        }


        //检查文件类型
        if(!in_array($file_img["type"], $img_type))
        {
            echo "文件类型不符!".$file_img["type"];
            exit;
        }


        if(isset($_POST["action"]) && $_POST["action"]=="上传")
        {

            if(!file_exists($head_img_floder))
            {
                mkdir($head_img_floder);
            }
        }

        $file_temp_upload_path = $file_img["tmp_name"];
        $path_info = pathinfo($file_img["name"]);
        //$save_img_name = $path_info["filename"];

        $file_type = $path_info["extension"];
       // $save_img_name = $_SESSION["userInfo"]["uid"]."_head_".date("Y_m_d_H_i_s",time()).".".$file_type;
        $save_img_name = $_SESSION["userInfo"]["uid"]."_head_img.".$file_type;
        $img_save_path = $img_save_path.$save_img_name;

      //  echo $img_save_path."</br>";

      //  print_r($path_info);

//        echo "</br>";
//        var_dump($path_info);
//        echo "</br>";

        //允许覆盖
        if(file_exists($img_save_path))
        {

           // echo "已存在同名文件";
           // exit;
        }

        if(!move_uploaded_file($file_temp_upload_path,$img_save_path))
        {
            echo "上传文件失败 </br>";
            exit;
        }
        else
        {

            $user_id = $_SESSION["userInfo"]["uid"];
            $sql_update = "update user set user_head='$save_img_name' where uid='$user_id'";
            $result = mysql_query($sql_update);
            if($result==false)
            {
                echo "更新数据库出错";
                exit;
            }
            else
            {
                echo "$save_img_name";
            }


            //header("Location:../html/userCenter.html");
            exit;
        }

    }


?>