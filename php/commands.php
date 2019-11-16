<?

// Логинимся логином и паролем
function cmdAuth($login, $password) {
    /*if(isset($_COOKIE["contortion_key"])) {
        $result = mysql_query("SELECT  * FROM tbl_users WHERE logkey='".$_COOKIE["contortion_key"]."'");
        sqlerr();
        if (mysql_num_rows($result)>0) {
            $this->buildSession(mysql_fetch_assoc($result));
        }
    }*/
}
        
// Разлогиниваемся
 function cmdLogOff() {
    @setcookie("p3user","---",time()-1);
    setcookie("plasma3","",time()-1,"/");

    session_start();
    session_unset();
    session_destroy();

    output('{status: "unauthorized"}');
}

// Получить канал - пачку первых сообщений плюс дайджесты с обновлениями
function cmdGetChannel($channelId, $lastVieved) {
    output('{"messages":' . getChannelJson($channelId, $lastVieved) . '}');
}

// Получить все сообщения треда
function cmdGetThread($threadId, $lastVieved) {
    output('{"messages":' . getThreadJson($threadId, $lastVieved) . '}');
}
    
// Получить список каналов
function cmdGetChannels($lastVieved) {
    output('{"channels":' . getChannelsJson() . '}');
}

?>