<?
error_reporting(E_ALL);

header('Content-Type: application/json; charset=UTF-8');
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET");

include("functions.php");
include("top_secret.php");

mysql_query("SET CHARACTER SET 'cp1251'");
mysql_query("SET NAMES 'utf8'");

switch(@$_REQUEST['cmd']) {

	case 'get_channel':
		$channelId = $_REQUEST['cid'];
		$lastVieved = $_REQUEST['lv'];
		//TODO: Проверка на доступ
		echo ('{"messages":' . getChannelJson($channelId, $lastVieved) . '}');
		break;

	case 'get_thread':
		$threadId = $_REQUEST['tid'];
		$lastVieved = $_REQUEST['lv'];
		//TODO: Проверка на доступ
		echo ('{"messages":' . getThreadJson($threadId, $lastVieved) . '}');
        break;
        
    case 'get_channels':
        $lastVieved = $_REQUEST['lv'];
        //TODO: Проверка на доступ
        echo ('{"channels":' . getChannelsJson() . '}');
        break;

	default:
		echo('{"error":"Unknown command"}');
		break;

}
?>