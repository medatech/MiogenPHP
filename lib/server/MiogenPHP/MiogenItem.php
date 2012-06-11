<?php

require_once('MiogenDataField.php');

class MiogenItem {
    
    var $href = null;
    var $data = array();
    
    public function __construct ($href, $dataFields = null) {
        $this->href = $href;
        if (!is_null($dataFields)) {
            $this->addFields($dataFields);
        }
    }
    
    public function getHref () {
        return $this->href;
    }
    
    public function addFields ($cfg) {
        foreach ($cfg as $name => $dataCfg) {
            $this->addField($name, $dataCfg);
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
    
    public function getValue ($name, $default = '') {
        if (isset($this->data[$name])) {
            return $this->data[$name]->getValue();
        }
        else {
            return $default;
        }
    }
}
?>
