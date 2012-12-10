<?php

class MiogenTrace {
    
    public static function log ($error) {
        error_log($error);
    }
    
}
?>