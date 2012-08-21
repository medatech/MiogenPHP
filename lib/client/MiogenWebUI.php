<?php

class MiogenWebUI {
    
    var $config;
    
    public function __construct ($config) {
        $this->config = $config;
    }
    
    public function render ($url) {
        if (isset($this->config['urls'][$url])) {
            $data = array(
                'viewFile' => $this->config['moduleUrl'] . '/Pages/' . $this->config['urls'][$url] . '.json',
                'miogenUrl' => $this->config['miogenUrl'],
                'apiUrl' => $this->config['apiUrl']
            );
            include('MiogenWebUIView.php');
        }
        else {
            header('HTTP/1.1 404 Not Found');
        }
    }
}


?>