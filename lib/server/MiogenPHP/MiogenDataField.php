<?php
/**
 * @author Martin Adams <martin.adams@miogen.com>
 * @license http://opensource.org/licenses/MIT MIT License
 */

/**
 * A representation of a data field used for templates and items
 * @package Miogen 
 */
class MiogenDataField {
    
    /**
     * Constructs a new data field
     * @param array $cfg Key/value pair of default properties this data field
     *                   is to contain
     */
    public function __construct ($cfg) {
        // Store the values directly in this object, but don't declare them
        // before hand as we want to simply export this object using json
        foreach ($cfg as $key => $value) {
            $this->$key = $value;
        }
    }
    
    /**
     * Get the name of the field
     * @return String
     */
    public function getName () {
        return isset($this->name) ? $this->name : null;
    }
    
    /**
     * Set the value of the field
     * @param mixed $value 
     */
    public function setValue ($value) {
        $this->value = $value;
    }
    
    /**
     * Get the value of the field
     * @return mixed
     */
    public function getValue () {
        return isset($this->value) ? $this->value : null;
    }
    
    /**
     * Get the default value of the field
     * @return mixed
     */
    public function getDefaultValue () {
        return isset($this->defaultValue) ? $this->defaultValue : null;
    }
    
    /**
     * Set the prompt attribute of the field
     * @param string $prompt 
     */
    public function setPrompt ($prompt) {
        $this->prompt = $prompt;
    }
    
    /**
     * Get the prompt attribute of the field
     * @return string
     */
    public function getPrompt () {
        return isset($this->prompt) ? $this->prompt : null;
    }
    
    /**
     * Set the data type of the field
     * @param string $type 
     */
    public function setType ($type) {
        $this->type = $type;
    }
    
    /**
     * Get the data type of the field
     * @return String 
     */
    public function getType () {
        return isset($this->type) ? $this->type : null;
    }
    
    /**
     * Get whether the field is required or not
     * @return boolean True if required, false if not
     */
    public function isRequired () {
        return isset($this->required) ? $this->required : true;
    }
    
    /**
     * Gets whether the field is read only or not
     * @return boolean True if read only, false if not
     */
    public function isReadOnly () {
        return isset($this->readOnly) ? $this->readOnly : false;
    }
    
    /**
     * For numeric data types get the step increments
     * @return int
     */
    public function getStep () {
        switch ($this->getType()) {
            case 'currency':
            case 'numeric': {
                return 1 / pow(10, $this->getDecimals());
            }
            default: return null;
        }
    }
    
    /**
     * For numeric data types get the number of decimals it is to represent
     * @return int
     */
    public function getDecimals () {
        if ($this->getType() == 'currency') {
            return 2;
        }
        else {
            return isset($this->decimals) ? $this->decimals : 0;
        }
    }
    
    /**
     * Get the minimum value that this field can have
     * @return int
     */
    public function getMin () {
        return isset($this->min) ? $this->min : null;
    }
    
    /**
     * Get the maximum value that this field can have
     * @return int
     */
    public function getMax () {
        return isset($this->max) ? $this->max : null;
    }
    
    public function setRel ($rel) {
        $this->rel = $rel;
    }
    
    public function getRel () {
        return isset($this->rel) ? $this->rel : null;
    }
}
?>