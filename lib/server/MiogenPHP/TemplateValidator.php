<?php

class TemplateValidator {
    
    var $template = null;
    
    var $errors = null;
    
    public function __construct (&$template) {
        $this->template = &$template;
    }
    
    public function getErrors () {
        return $this->errors;
    }
    
    public function validate ($userData) {
        $this->errors = array();
        
        $this->validateContains($userData, array(
            'data' => 'object'
        ));
        
        $validateData = is_null($userData) ? array() : $userData;
        if (isset($userData['data'])) {
            $validateData = $userData['data'];
        }
        else {
            $validateData = array();
        }
        $this->validateData($validateData, $this->template->getFields());
        
        return count($this->errors) == 0;
    }
    
    private function validateData ($userData, $templateData) {
        
        // Go through every field in the data and validate each field
        foreach ($userData as $field => $fieldData) {
            // Make sure the template defines this field
            if (!isset($templateData[$field])) {
                $this->errors[] = array(
                    'prompt' => 'Unexpected data field "' . $field . '"',
                    'inlinePrompt' => 'Invalid',
                    'field' => $field
                );
            }
            else {
                // Validate the field
                $this->validateField($field, $fieldData, $templateData[$field]);
            }
        }
        
        // Then go through each template field and make sure the required fields exist
        foreach ($templateData as $field => $templateField) {
            $required = isset($templateField['required']) ? $templateField['required'] : false;
            
            if ($required && !isset($userData[$field])) {
                $this->errors[] = array(
                    'prompt' => 'Missing required field "' . $field . '"',
                    'inlinePrompt' => 'Required',
                    'field' => $field
                );
            }
            else {
                $readOnly = isset($templateField['readOnly']) ? $templateField['readOnly'] : false;
                if ($readOnly && isset($userData[$field])) {
                    $this->errors[] = array(
                        'prompt' => 'Not allowed to specify field "' . $field . '" as it is read only',
                        'inlinePrompt' => 'Read only',
                        'field' => $field
                    );
                }
            }
        }
    }
    
    private function getFieldProperties ($templateData) {
        $properties = array(
            'required' => false,
            'readOnly' => false,
            'minLen' => 0,
            'maxLen' => null, // No max len
            'min' => null, // No min
            'max' => null, // No max
            'decimals' => null, // No decimal precision
            'prompt' => null, // No prompt
            'type' => 'text',
            'options' => array(), // Default to no choice options when type is choice
            'items' => array(), // Default to no items when type is array
            'query' => null,
            'data' => null
        );
        
        // Now mix in the template values
        foreach ($templateData as $attr => $value) {
            $properties[attr] = $value;
        }
        
        return $properties;
    }
    
    private function getDecimals ($value) {
        $parts = explode('.', $value . '');
        if (count($parts) === 1) {
            return 0;
        }
        else {
            return strlen($parts[1]);
        }
    }
    
    private function isUrl ($url) {
        return filter_var($url, FILTER_VALIDATE_URL) !== false;
    }
    
    private function isValidChoice ($value, $options) {
        if (is_null($options) && !is_null($value)) {
            return false; // No options specified, so it should not have a value set
        }
        
        for ($i = 0, $iLen = count($options); $i < $iLen; $i += 1) {
            if ($options[$i]['value'] == $value) {
                return true;
            }
        }
        
        return false;
    }
    
    private function isTime ($time) {
        return preg_match("#([0-1]{1}[0-9]{1}|[2]{1}[0-3]{1}):[0-5]{1}[0-9]{1}#", $time);
    }
    
    private function validateField ($fieldName, $fieldData, $templateData) {
        
        $validateValue = true;
        
        $props = $this->getFieldProperties($templateData);
        $value = is_null($fieldData) ? null : (isset($fieldData['value']) ? $fieldData['value'] : null);
        $type = gettype($value);
        
        switch ($props['type']) {
            case 'text':
            case 'password': {
                if ($type != 'NULL' && $type != 'string') {
                    $this->errors[] = array(
                        'prompt' => 'Field "' . $fieldName . '" must be a string',
                        'inlinePrompt' => 'Not a string',
                        'field' => $fieldName
                    );
                }
                break;
            }
            case 'email': {
                $this->validateContains($fieldData, array('value' => 'string'));
                if (filter_var($value, FILTER_VALIDATE_EMAIL) === false) {
                    $this->errors[] = array(
                        'prompt' => 'Field "' . $fieldName . '" is not a valid email address',
                        'inlinePrompt' => 'Invalid',
                        'field' => $fieldName
                    );
                }
                break;
            }
            case 'boolean': {
                if ($type != 'NULL' && $type != 'boolean') {
                    $this->errors[] = array(
                        'prompt' => 'Field "' . $fieldName . '" must be boolean',
                        'inlinePrompt' => 'Invalid',
                        'field' => $fieldName
                    );
                }
                break;
            }
            case 'number': {
                if ($type != 'NULL' && $type != 'integer' && $type != 'double') {
                    $this->errors[] = array(
                        'prompt' => 'Field "' . $fieldName . '" must be a number',
                        'inlinePrompt' => 'Invalid',
                        'field' => $fieldName
                    );
                }
                else {
                    // Validate the number of decimals
                    if (!is_null($value) && !is_null($props['decimals']) &&
                            $this->getDecimals($value) > $props['decimals']) {
                        $this->errors[] = array(
                            'prompt' => 'Field "' . $fieldName . '" must have a maximum of ' . $props['decimals'] . ' decimal place' . ($props['decimals'] == 1 ? '' : 's'),
                            'inlinePrompt' => 'Too many decimals',
                            'field' => $fieldName);
                    }
                }
                break;
            }
            case 'url': {
                if ($type != 'NULL' && $type != 'string') {
                    $this->errors[] = array(
                        'prompt' => 'Field "' . $fieldName . '" must be a string',
                        'inlinePrompt' => 'Not a string',
                        'field' => $fieldName
                    );
                }
                else {
                    // Validate it is a URL
                    if (!is_null($value) && $this->isUrl($value) == false) {
                        $this->errors[] = array(
                            'prompt' => 'Field "' . $fieldName . '" must be a valid URL',
                            'inlinePrompt' => 'Invalid',
                            'field' => $fieldName
                        );
                    }
                }
                break;
            }
            case 'timestamp':
            case 'date': {
                if ($type != 'NULL' && $type != 'integer') {
                    $this->errors[] = array(
                        'prompt' => 'Field "' . $fieldName . '" must be a timestamp',
                        'inlinePrompt' => 'Not a timestamp',
                        'field' => $fieldName
                    );
                }
                break;
            }
            case 'time': {
                if ($type == 'NULL' && !$this->isTime($value)) {
                    $this->errors[] = array(
                        'prompt' => 'Field "' . $fieldName . '" must be a valid time',
                        'inlinePrompt' => 'Invalid',
                        'field' => $fieldName
                    );
                }
                break;
            }
            case 'choice': {
                if (!is_null($value)) {
                    if (!$this->isValidChoice($value, $props['options'])) {
                        $this->errors[] = array(
                            'prompt' => 'Field "' . $fieldName . '" contains an invalid choice',
                            'inlinePrompt' => 'Invalid choice',
                            'field' => $fieldName
                        );
                    }
                }
                break;
            }
            case 'group': {
                // This is a sub group, so validate that
                if (!isset($fieldData['data'])) {
                    $this->errors[] = array(
                        'prompt' => 'Field "' . $fieldName . '" must contain a data child',
                        'inlinePrompt' => 'Missing data child',
                        'field' => $fieldName
                    );
                }
                else {
                    $this->validateData($fieldData['data'], is_null($props['data']) ? array() : $props['data']);
                }
                $validateValue = false;
                break;
            }
            case 'array': {
                if ($type != 'NULL' && $type != 'array') {
                    $this->errors[] = array(
                        'prompt' => 'Field "' . fieldName . '" must be an array',
                        'inlinePrompt' => 'Not an array',
                        'field' => $fieldName
                    );
                }
                else {
                    // This means that the vvalue is an array of child items which must each be validated
                    if (!is_null($props['min'])) {
                        if ($props['min'] > 0 && !is_null($fieldData)) {
                            // We expect at least one item but it wasn't supplied
                            $this->errors[] = array(
                                'prompt' => 'Field "' . $fieldName . '" is required',
                                'inlinePrompt' => 'Required',
                                'field' => $fieldName
                            );
                        }
                        elseif ($props['min'] > count($fieldData)) {
                            // We don't have enough items
                            $this->errors[] = array(
                                'prompt' => 'Field "' . $fieldName . '" must have at least ' . $props['min'] . ' item' . ($props['min'] == 1 ? '' : 's'),
                                'inlinePrompt' => 'Not enough items',
                                'field' => $fieldName
                            );
                        }
                    }
                    
                    if (!is_null($props['max']) && !is_null($fieldData)) {
                        if ($props['max'] < count($fieldData)) {
                            // We have too many items
                            $this->errors[] = array(
                                'prompt' => 'Field "' . $fieldName . '" must have at most ' . $props['max'] . ' item' . ($props['max'] == 1 ? '' : 's'),
                                'inlinePrompt' => 'Too many items',
                                'field' => $fieldName
                            );
                        }
                    }
                    
                    // Validate each item
                    if (!is_null($fieldData)) {
                        for ($i = 0, $iLen = count($fieldData); $i < $iLen; $i += 1) {
                            $item = $fieldData[$i];
                            
                            if (!isset($item['data'])) {
                                $this->errors[] = array(
                                    'prompt' => 'Field "' . $fieldName . '[' . $i . '] must contain a data child',
                                    'inlinePrompt' => 'Missing data child',
                                    'field' => $fieldName . '[' . $i . ']'
                                );
                            }
                            else {
                                $this->validateData($item['data'], isset($templateData['data']) ? $templateData['data'] : array());
                            }
                        }
                    }
                }
                
                $validateValue = false;
                break;
            }
            default: {
                $this->errors[] = array(
                    'prompt' => 'Unknown template type "' . $props['type'] . '"'
                );
            }
        }
        
        if ($validateValue) {
            // Validate required field
            if (is_null($value) && $props['required']) {
                $this->errors[] = array(
                    'prompt' => 'Field "' . $fieldName . '" is required',
                    'inlinePrompt' => 'Required',
                    'field' => $fieldName
                );
            }
            
            // Validate the length
            if (!is_null($props['minLen']) && !is_null($value) && strlen(''.$value) < $props['minLen']) {
                $this->errors[] = array(
                    'prompt' => 'Field "' . $fieldName . '" must be at least ' . $props['minLen'] . ' character' . ($props['minLen'] == 1 ? '' : 's'),
                    'inlinePrompt' => 'Too short',
                    'field' => $fieldName
                );
            }
            
            if (!is_null($props['maxLen']) && !is_null($value) && strlen(''.$value) > $props['maxLen']) {
                $this->errors[] = array(
                    'prompt' => 'Field "' . $fieldName . '" must be no more than ' . $props['maxLen'] . ' character' . ($props['maxLen'] == 1 ? '' : 's'),
                    'inlinePrompt' => 'Too long',
                    'field' => $fieldName
                );
            }
            
            if (!is_null($props['min']) && !is_null($value) && $value < $props['min']) {
                $this->errors[] = array(
                    'prompt' => 'Field "' . $fieldName . '" must be no less than ' . $props['min'],
                    'inlinePrompt' => 'Below minimum',
                    'field' => $fieldName
                );
            }
            
            if (!is_null($props['max']) && !is_null($value) && $value > $props['max']) {
                $this->errors[] = array(
                    'prompt' => 'Field "' . $fieldName . '" must be no more than ' . $props['max'],
                    'inlinePrompt' => 'Above maximum',
                    'field' => $fieldName
                );
            }
        }
    }
    
    private function validateContains ($obj, $children) {
        // First make sure all the object children exist in the valid children
        foreach ($obj as $objKey) {
            // Make sure it is expected
            if (isset($children[$objKey])) {
                $objValue = $obj[$objKey];
                
                // Make sure it's the correct type
                if (gettype($objValue) !== $children[$objKey] || is_null($objValue)) {
                    $this->errors[] = array(
                        'prompt' => 'Invalid object for element "' . $objKey . '", expected "' . $children[$objKey] . '" but was "' .
                            gettype($objValue) . '"'
                    );
                }
            }
            else {
                $this->errors[] = array(
                    'prompt' => 'Unexpected element "' . $objKey . '"'
                );
            }
        }
        
        // Now see if there are any missing children
        if (!is_null($obj)) {
            foreach ($children as $objKey) {
                if (!isset($obj[$objKey])) {
                    $this->errors[] = array(
                        'prompt' => 'Missing element "' . $objKey . '"'
                    );
                }
            }
        }
    }
}

?>