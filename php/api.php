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

// Массив, в который набъются json'ы из всех выполнившихся команд. 
// Потом их склеим и выдадим клиенту.

$outputBuffer = array(); 

// Достаём id юзера из сессии

session_start();
//$_SESSION['plasmax_user_id'] = 0; // <<<<<<<<<<<<<<<<<<<<<<<<
$userId = @$_SESSION['plasmax_user_id'];

// Если сессия протухла - пытаемся создаёть её по ключу в куках

if (empty($userId)) {
    $key = getCookieKey();

    //$key = '39DF8C67-639C-446B-8F81-42FB3F5893F1'; // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    if (isset($key)) {
        $result = mysql_query('SELECT * FROM tbl_users WHERE logkey="'.$key.'" LIMIT 1');
        sqlerr();

        if (mysql_num_rows($result) > 0) {
            $rows = mysql_fetch_assoc($result);
            $userId = intval($rows['id_user']);
            $_SESSION['plasmax_user_id'] = $userId;

            // Ключ меняем
            $key = createCookieKey($userId);

            echo ('{"status": "authorized"}');
        }
    }
}

// Если так и не нашли юзера

if (empty($userId)) {
    output('{"status": "unauthorized"}');
    die;
}

// Выполняем команды

switch(@$_REQUEST['cmd']) {

    // логинимся по ключу в куках
    case 'start_session':

        echo ('{"session":' . $uid . '}');
        break;
        
    // Логинимся логином и паролем
    case 'auth':
        if(isset($_COOKIE["contortion_key"])) {
            $result = mysql_query("SELECT  * FROM tbl_users WHERE logkey='".$_COOKIE["contortion_key"]."'");
            sqlerr();
            if (mysql_num_rows($result)>0) {
                $this->buildSession(mysql_fetch_assoc($result));
            }
        }
        break;
        
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
		echo('{"error":"Unknown command"}');
		break;

}

// Строим результирующее сообщение для клиента

flushOutputBuffer();

?>