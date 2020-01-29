<?
include("top_secret.php");
include("functions.php");
include("commands.php");

error_reporting(E_ALL);

session_start();

header('Content-Type: application/json; charset=UTF-8');
header("Access-Control-Allow-Headers: Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With, X-Auth-Token");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: http://localhost:4200"); // CORS

mysql_query("SET CHARACTER SET 'cp1251'");
mysql_query("SET NAMES 'utf8'");

// id юзера, да
$userId = NULL;

// Команда юзера
$command = @$_REQUEST['cmd'];

// Массив, в который набъются json'ы ответов всех выполнившихся команд. 
// Потом их склеим и выдадим клиенту.
$outputBuffer = array();

// Массив с лог-сообщениями, которые добавятся в выдачу на клиент
$logBuffer = array();

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

    case 'start':
        cmdGetChannels('2019-10-12 23:45:18'); // <<<<<<<<<<<<<<<<<<<<<<< сделай нормальный lasviewed
        break;

    case 'get_channels':
        cmdGetChannels($_REQUEST['lv']);
        break;

	case 'get_channel':
        cmdGetChannel($_REQUEST['cid'], $_REQUEST['lv']);
		break;

	case 'get_thread':
        cmdGetThread($_REQUEST['tid'], $_REQUEST['lv']);
        break;
}

// Отдаём клиенту ответы команд

sendResponce();

?>