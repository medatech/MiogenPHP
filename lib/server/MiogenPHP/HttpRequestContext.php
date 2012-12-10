<?php
require_once('RequestContext.php');

class HttpRequestContext extends RequestContext {
    
    public function __construct (&$miogen) {
        parent::__construct($miogen);
        $this->miogen = &$miogen;
    }
    
    public function getMethod () {
        return $_SERVER['REQUEST_METHOD'];
    }
    
    public function getRawDocument () {
        $postData = file_get_contents('php://input');
        return json_decode($postData, true);
    }
}
?>