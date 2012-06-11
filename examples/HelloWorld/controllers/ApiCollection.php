<?php

require_once(APP_ROOT . '/../../lib/server/MiogenPHP/MiogenRestModule.php');

class ApiCollection extends MiogenRestModule {
    
    public function getSupportedMethods() {
        return array('GET');
    }
    
    public function doGet(&$request, &$response) {
        $root = $request->getMiogen()->getConfig('resourceRoot');
        
        $doc = new MiogenDocument($root . $request->getUrl());
        $doc->setPrompt('API');
        
        $doc->addLink($root . '/API/HelloWorld/', 'message', 'Hello World Messages');
        
        $response->setResponseData($doc);
        $response->setStatusCode(200);
    }
    
}
?>