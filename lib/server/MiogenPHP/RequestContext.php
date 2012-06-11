<?php

class RequestContext {
    
    var $miogen = null;
    var $url = null;
    var $restModuleName = null;
    var $parameters = array();
    
    public function __construct (&$miogen) {
        $this->miogen = &$miogen;
    }
    
    public function &getMiogen() {
        return $this->miogen;
    }
    
    public function setUrl ($url) {
        $this->url = $url;
    }
    
    public function getUrl () {
        return $this->url;
    }
    
    public function setRestModuleName ($moduleName) {
        $this->restModuleName = $moduleName;
    }
    
    public function getRestModuleName () {
        return $this->restModuleName;
    }
    
    public function setParameter($key, $value) {
        if (isset($this->parameters[$key])) {
            // Append it
            $this->parameters[$key][] = $value;
        }
        else {
            // Create the array with it in
            $this->parameters[$key] = array($value);
        }
    }
    
    public function getMethod() {
        return $_SERVER['REQUEST_METHOD'];
    }
}
?>
