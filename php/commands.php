<?

// Проверяем, не протухла ли сессия. Если протухла, пытаемся восстановить её по ключу в куках.
function cmdCheckSessionStatus() {
    global $userId;

    // Достаём id юзера из сессии
    $_SESSION['plasmax_user_id'] = 0; // <<<<<<<<<<<<<<<<<<<<<<<<
    $userId = @$_SESSION['plasmax_user_id'];

    // Если сессия протухла - пытаемся создаёть её по ключу в куках
    if (empty($userId)) {
        $key = getCookieKey();

        $key = '341C2DE7-AE8D-4FF6-8DC8-383120CE0DDB'; // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

        if (isset($key)) {
            $result = mysql_query('SELECT * FROM tbl_users WHERE logkey="' . $key . '" LIMIT 1');
            sqlerr();

            if (mysql_num_rows($result) > 0) {
                $rows = mysql_fetch_assoc($result);

                // Вот он наш юзер. Запишем его id в сессию, а новый ключ в куки
                $userId = intval($rows['id_user']);
                $_SESSION['plasmax_user_id'] = $userId;
                //createCookieKey($userId); // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

                respond('status', '{"authorized": "true"}');
            }
        }
    }
}

// Логинимся логином и паролем
function cmdAuthenticate($login, $password) {
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

    respond('status', '{authorized: "false"}');
}

// Получить канал - пачку первых сообщений плюс дайджесты с обновлениями
function cmdGetChannel($channelId, $lastVieved) {
    respond('channel', '{"id":' . $channelId . ', "messages":' . getChannelJson($channelId, $lastVieved) . '}');
}

// Получить все сообщения треда
function cmdGetThread($threadId, $lastVieved) {
    respond('thread', '{"id":"' . $threadId . '", "messages":' . getThreadJson($threadId, $lastVieved) . '}');
}
    
// Получить список каналов
function cmdGetChannels($lastVieved) {
    respond('channels', '{"channels":' . getChannelsJson() . '}');
}

?>