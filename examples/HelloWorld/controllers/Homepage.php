<?php
require_once(APP_ROOT . '/../../lib/server/MiogenPHP/MiogenRestModule.php');

class Homepage extends MiogenRestModule {
    
    public function getSupportedMethods() {
        return array('GET');
    }
    
    public function doGet(&$request, &$response) {
        $response->setViewName('homepage');
        $response->setStatusCode(200);
    }
    
}
?>