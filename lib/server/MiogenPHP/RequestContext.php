<?php

class RequestContext {
    
    var $miogen = null;
    var $url = null;
    var $restModuleName = null;
    var $parameters = array();
    var $method = 'GET';
    
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
    
    public function setParameter ($key, $value) {
        if (isset($this->parameters[$key])) {
            // Append it
            $this->parameters[$key][] = $value;
        }
        else {
            // Create the array with it in
            $this->parameters[$key] = array($value);
        }
    }
    
    public function getParameter ($key, $defaultValue = '') {
        if (isset($this->parameters[$key])) {
            return count($this->parameters[$key]) > 0 ? $this->parameters[$key][0] : $defaultValue;
        }
        else {
            return $defaultValue;
        }
    }
    
    public function getMethod () {
        return $this->method;
    }
    
    public function setMethod ($method) {
        $this->method = $method;
    }
    
    public function getRawDocument () {
        return array();
    }
}
?>
