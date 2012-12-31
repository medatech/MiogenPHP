<?php

require_once('MiogenDataField.php');

class MiogenQuery {
    
    /* var $name = null; */
    /* var $rel = null; */
    var $data = array();
    var $method = 'GET';
    
    public function __construct ($name = null, $rel = null) {
        if (!is_null($name)) {
            $this->name = $name;
        }
        if (!is_null($rel)) {
            $this->rel = $rel;
        }
    }
    
    public function getName () {
        return isset($this->name) ? $this->name : null;
    }
    
    public function setRel ($rel) {
        $this->rel = $rel;
    }
    
    public function getRel () {
        return isset($this->rel) ? $this->rel : null;
    }
    
    public function setTemplateName ($templateName) {
        $this->template = $templateName;
    }
    
    public function getTemplateName () {
        return isset($this->template) ? $this->template : null;
    }
    
    public function setMethod ($method) {
        $this->method = $method;
    }
    
    public function getMethod () {
        if (isset($this->method)) {
            return $this->method;
        }
        else {
            return 'GET';
        }
    }
    
    public function addField ($name, $cfg) {
        $this->data[$name] = new MiogenDataField($cfg);
    }
    
    public function getField ($name) {
        if (isset($this->data[$name])) {
            return $this->data[$name];
        }
        else {
            return null;
        }
    }
    
    public function getFields () {
        return $this->data;
    }
    
}
?>