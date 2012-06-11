<?php

class MiogenDataField {
    
    //var $value = null;
    //var $prompt = null;
    //var $type = null;
    
    public function __construct ($cfg) {
        foreach ($cfg as $key => $value) {
            $this->$key = $value;
        }
    }
    
    public function getName () {
        return $this->name;
    }
    
    public function setValue ($value) {
        $this->value = $value;
    }
    
    public function getValue () {
        return isset($this->value) ? $this->value : null;
    }
    
    public function getDefaultValue () {
        return isset($this->defaultValue) ? $this->defaultValue : null;
    }
    
    public function setPrompt ($prompt) {
        $this->prompt = $prompt;
    }
    
    public function getPrompt () {
        return isset($this->prompt) ? $this->prompt : null;
    }
    
    public function setType ($type) {
        $this->type = $type;
    }
    
    public function getType () {
        return isset($this->type) ? $this->type : null;
    }
    
    public function isRequired () {
        return isset($this->required) ? $this->required : false;
    }
    
    public function getStep () {
        switch ($this->getType()) {
            case 'currency':
            case 'numeric': {
                return 1 / pow(10, $this->getDecimals());
            }
            default: return null;
        }
    }
    
    public function getDecimals () {
        if ($this->getType() == 'currency') {
            return 2;
        }
        else {
            return isset($this->decimals) ? $this->decimals : 0;
        }
    }
    
    public function getMin () {
        return isset($this->min) ? $this->min : null;
    }
    
    public function getMax () {
        return isset($this->max) ? $this->max : null;
    }
}
?>
