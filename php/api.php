<?
error_reporting(E_ALL);

header('Content-Type: application/json; charset=UTF-8');
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET");

include("top_secret.php");
include("functions.php");
include("commands.php");

mysql_query("SET CHARACTER SET 'cp1251'");
mysql_query("SET NAMES 'utf8'");

session_start();

// Команда юзера

$command = @$_REQUEST['cmd'];

// Массив, в который набъются json'ы ответов всех выполнившихся команд. 
// Потом их склеим и выдадим клиенту.

$outputBuffer = array();

// Команды, работающие без авторизации

/*if(isset($_COOKIE["contortion_key"])) {
    $result = mysql_query("SELECT  * FROM tbl_users WHERE logkey='" . $_COOKIE["contortion_key"] . "'");
    sqlerr();
    if (mysql_num_rows($result)>0) {
        $this->buildSession(mysql_fetch_assoc($result));
    }
}*/

// Проверяем, авторизован ли юзер
// Если нет - отдаём клиенту ответы команд и сдыхаем

cmdCheckSessionStatus();
if (!isAuthorized()) {
    respond('status', '{"authorized": "false"}');
    sendResponce();
    die;
}

// Если авторизовались - выполняем команды для авторизованных юзеров

switch ($command) {

    case 'log_off':
        cmdLogOff();
        break;

	case 'get_channel':
        cmdGetChannel($_REQUEST['cid'], $_REQUEST['lv']);
		break;

	case 'get_thread':
        cmdGetThread($_REQUEST['tid'], $_REQUEST['lv']);
        break;
        
    case 'get_channels':
        cmdGetChannels($_REQUEST['lv']);
        break;

	default:
        respond($command, '{"error":"Unknown command `' . $command . '`"}');
		break;

}

// Отдаём клиенту ответы команд

sendResponce();

?>