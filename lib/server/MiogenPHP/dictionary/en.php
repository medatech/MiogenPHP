<?php

class MiogenDictionary_en {
    
    const MODULE_NOT_FOUND = 'The supplied URL was valid, but the module to handle it could not be found';
    const METHOD_NOT_SUPPORTED = 'HTTP method not allowed';
    
    public function populate ($text, $args) {
        for ($i = 0; $i < count($args); $i += 1) {
            $text = str_replace('{0}', $args[$i], $text);
        }
        return $text;
    }
}

?>
