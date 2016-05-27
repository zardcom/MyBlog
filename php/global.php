<?php
    /**
     * Created by IntelliJ IDEA.
     * User: 哔哔的麻雀
     * QQ:   657850227
     * Date: 2016/4/19
     * Time: 23:42
     */

    include "dbConenct.php";

    $data1= "2016-05-16 03:58";
    echo $data1."</br>";

    $now_time = date("Y-m-d H:i:s",time());
    echo "当前时间：".$now_time."</br>";

    echo "最后回复：".timeChange($data1)."</br>";



   $lll = date('Y-m-d',strtotime("2016-05-16 22:47:56"));
    $file_name = date("Y_m_d_H_i_s",time());

    echo "数量: ".$file_name;



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
                return date("Y-m-d",strtotime($the_time));
                break;
        }
        return $the_time;
    }

?>