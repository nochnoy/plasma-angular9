<?
error_reporting(E_ALL);

session_start();

include("top_secret.php");
include("functions.php");
include("commands.php");

mysql_query("SET CHARACTER SET 'cp1251'");
mysql_query("SET NAMES 'utf8'");

// Команда юзера

$command = @$_REQUEST['cmd'];

// Массив, в который набъются json'ы ответов всех выполнившихся команд. 
// Потом их склеим и выдадим клиенту.

$outputBuffer = array();

// Команды, работающие без авторизации

switch ($command) {

    case 'login':
        cmdLogin($_REQUEST['login'], $_REQUEST['password']);
        break;

    case 'log_out':
        cmdLogOff();
        sendResponce();
        die;
        break;

}

// Проверяем, авторизован ли юзер

cmdCheckSessionStatus();

if (isAuthorized()) {
    respond('status', '{"authorized": true}');
} else {
    // Если нет - отдаём клиенту ответы команд и умираем
    respond('status', '{"authorized": false}');
    sendResponce();
    die;
}

// Если авторизовались - выполняем команды для авторизованных юзеров

switch ($command) {

	case 'get_channel':
        cmdGetChannel($_REQUEST['cid'], $_REQUEST['lv']);
		break;

	case 'get_thread':
        cmdGetThread($_REQUEST['tid'], $_REQUEST['lv']);
        break;
        
    case 'get_channels':
        cmdGetChannels($_REQUEST['lv']);
        break;
}

// Отдаём клиенту ответы команд

sendResponce();

?>