<?php
ini_set('display_errors', 'on');

// Define the application root to this directory.  This global is not used by the MiogenPHP library.
define('APP_ROOT', dirname(__FILE__));

// Include the Miogen PHP REST Handler
require_once('../../lib/server/MiogenPHP/MiogenRest.php');

// Create a config to map the application URLs, module path to
$restConfig = array(
    'urls' => array(
        '/' => 'Homepage',
        '/API/' => 'ApiCollection',
        '/API/Contacts/' => 'ContactCollection',
        '/API/Addresses/' => 'AddressCollection'
    ),
    'controllerPath' => APP_ROOT . DIRECTORY_SEPARATOR . 'controllers',
    'resourceRoot' => (@$_SERVER['HTTPS'] == 'on' ? 'https://' : 'http://') .
                      ($_SERVER['SERVER_PORT'] == '80' ? '' : ':80') .
                       $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'],
    'viewPath' => APP_ROOT . DIRECTORY_SEPARATOR  . 'views'
);

$rest = new MiogenRest($restConfig);
$response = &$rest->process('/' . $_GET['url']);
$response->render();
?>