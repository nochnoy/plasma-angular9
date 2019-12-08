<?

// Проверяем, не протухла ли сессия. Если протухла, пытаемся восстановить её по ключу в куках.
function cmdCheckSessionStatus() {
    global $userId;

    // Достаём id юзера из сессии
    //$_SESSION['plasmax_user_id'] = 0; // <<<<<<<<<<<<<<<<<<<<<<<< делаем вид что сессия протухла
    $userId = @$_SESSION['plasmax_user_id'];

    // Если сессия протухла - пытаемся создаёть её по ключу в куках
    if (empty($userId)) {
        $key = getCookieKey();

        lll('auth from key: '.$key);

         //$key = '341C2DE7-AE8D-4FF6-8DC8-383120CE0DDB'; // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

        if (isset($key)) {
            lll('  yes, we have key');
            $result = mysql_query('SELECT * FROM tbl_users WHERE logkey="'.$key.'" LIMIT 1');
            sqlerr();

            // Юзер найден
            if (mysql_num_rows($result) > 0) {
                lll('  and user found');
                $rows = mysql_fetch_assoc($result);
                initSession(intval($rows['id_user']));
            }
        }
    } else {
        lll('auth from session successfully');
    }
}

// Логинимся логином и паролем
function cmdLogin($login, $password) {
    $result = mysql_query('SELECT * FROM tbl_users WHERE login="'.$login.'" AND password="'.$password.'"');
    if (mysql_num_rows($result) > 0) {
        // Правильный логин и пароль. Инитим сессию, пропускаем внутрь.
        $rows = mysql_fetch_assoc($result);
        initSession(intval($rows['id_user']));
        respond('login', '{"userName": "'.$rows['nick'].'"}');
    } else {
        // Неправильный логин или пароль. Расстрелять.
        respond('login', '{error: "incorrect_login_password"}');
    }
}
        
// Разлогиниваемся
function cmdLogOff() {
    global $userId;

    unset($userId);
    unset($_SESSION['plasmax_user_id']);

    //@setcookie("p3user","---",time()-1);
    //setcookie("plasma3","",time()-1,"/");
    clearCookieKey();

    session_unset();
    session_destroy();

    respond('status', '{"authorized": false}');
}

// Получить канал - пачку первых сообщений плюс дайджесты с обновлениями
function cmdGetChannel($channelId, $lastVieved) {
    respond('channel', '{"id":'.$channelId.', "messages":'.getChannelJson($channelId, $lastVieved).'}');
}

// Получить все сообщения треда
function cmdGetThread($threadId, $lastVieved) {
    respond('thread', '{"id":"'.$threadId.'", "messages":'.getThreadJson($threadId, $lastVieved).'}');
}
    
// Получить список каналов
function cmdGetChannels($lastVieved) {
    respond('channels', '{"channels":'.getChannelsJson().'}');
}

?>