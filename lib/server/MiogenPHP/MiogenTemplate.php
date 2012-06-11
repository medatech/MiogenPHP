<?php

require_once('MiogenDataField.php');

class MiogenTemplate {
    
    /* var $name = null; */
    var $data = array();
    
    public function __construct ($name = null) {
        if (!is_null($name)) {
            $this->name = $name;
        }
    }
    
    public function getName () {
        return isset($this->name) ? $this->name : null;
    }
    
    public function setAllowPost ($value = true) {
        $this->allowPost = $value;
    }
    
    public function allowPost () {
        if (isset($this->allowPost)) {
            return $this->allowPost;
        }
        else {
            false;
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
