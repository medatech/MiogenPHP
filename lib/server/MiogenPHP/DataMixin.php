<?php
require_once('MiogenDataField.php');

class DataMixin {
    
    public function __construct () {
    }
    
    public static function mixin (&$targetData, &$userData, &$templateData, $setDefaults) {
        
        // Go through all the template items and if they exist in the user data, set them
        foreach ($templateData as $field => $fieldValue) {
            if ($fieldValue->getType() == 'group') {
                // It's a gropu, so make sure it exists on the target side
                if (!isset($targetData[$field])) {
                    $targetData[$field] = new MiogenItem();
                }
                
                $userGroupData = isset($userData[$field]) && isset($userData[$field]['data']) ? $userData[$field]['data'] : array();
                
                // Now recursively process the group
                $fieldData = $fieldValue->getData();
                $targetItemData = &$targetData[$field]->getData();
                DataMixin::mixin($targetItemData, $userGroupData, $fieldData, $setDefaults);
            }
            elseif ($fieldValue->getType() == 'array') {
                $targetData[$field] = array();
                
                $fieldData = $templateData[$field]->getData();
                if (isset($userData[$field])) {
                    for ($i = 0; $i < count($userData[$field]); $i += 1) {
                        $arrayData = array('data' => array());
                        DataMixin::mixin($arrayData['data'], $userData[$field][$i]['data'], $fieldData, $setDefaults);
                        $targetData[$field][] = $arrayData;
                    }
                }
            }
            else {
                // Set the value if present in the user data
                if (isset($userData[$field]) && isset($userData[$field]['value'])) {
                    $value = $userData[$field]['value'];
                    // Clean the data from any xss attacks
                    if (gettype($value) == 'string') {
                        $cleanValue = filter_var($value, FILTER_SANITIZE_STRING);
                    }
                    else {
                        $cleanValue = $value;
                    }
                    
                    if (!isset($targetData[$field])) {
                        $targetData[$field] = new MiogenDataField(array(
                            'value' => $cleanValue
                        ));
                    }
                    else {
                        $targetData[$field]->setValue($cleanValue);
                    }
                }
                else {
                    // The user data doesn't specify a value, so set it if we want to set defaults
                    if ($setDefaults) {
                        $targetData[$field] = new MiogenDataField(array(
                            'value' => $templateData[$field]->getDefaultValue()
                        ));
                    }
                }
            }
        }
    }
}

?>