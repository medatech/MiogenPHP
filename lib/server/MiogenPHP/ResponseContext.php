<?php

class ResponseContext {
    
    var $miogen = null;
    var $statusCode = 0;
    var $errors = array();
    var $headers = array();
    var $viewName = null;
    var $document = null;
    var $contentType = null;
    
    public function __construct (&$miogen) {
        $this->miogen = &$miogen;
    }
    
    public function &getMiogen() {
        return $this->miogen;
    }
    
    public function setStatusCode ($code) {
        $this->statusCode = $code;
    }
    
    public function getStatusCode () {
        return $this->statusCode;
    }
    
    public function addError ($error) {
        $this->errors[] = $error;
    }
    
    public function addHeader ($header, $value) {
        $this->headers[$header] = $value;
    }
    
    public function setViewName ($name) {
        $this->viewName = $name;
    }
    
    public function render () {
        $this->contentType = $this->getContentType();
        
        $this->outputHeaders();
        if (count($this->errors) > 0) {
            $this->outputErrors();
        }
        else {
            $this->outputBody();
        }
    }
    
    private function outputErrors () {
        for ($i = 0; $i < count($this->errors); $i += 1) {
            print($this->errors[$i]->getMessage() . "\r\n");
        }
    }
    
    private function getContentType () {
        return $this->getPreferredContentType(array('text/html', 'vnd.miogen+json'));
    }
    
    /**
     * Returns the lowercase preferred type based on the client accept types
     */
    function getPreferredContentType($supportedTypes) {
        
        $clientAcceptTypes = array();
        
        // Accept header is case insensitive, and whitespace isn’t important
        $accept = strtolower(str_replace(' ', '', $_SERVER['HTTP_ACCEPT']));
        $acceptParts = explode(',', $accept);
        foreach ($acceptParts as $type) {
            $quality = 1;
            
            // See if the quality was defined by the client
            if (strpos($type, ';q=') !== false) {
                // Split the type and the quality
                list($type, $quality) = explode(';q=', $type);
            }
            
            if ($quality > 0) {
                $clientAcceptTypes[$type] = $quality;
            }
        }
        
        // Sort them in order of preference
        arsort($clientAcceptTypes);
        
        for ($i = 0; $i < count($supportedTypes); $i += 1) {
            $supportedTypes[$i] = strtolower($supportedTypes[$i]);
        }
        // Now find the preferred match
        foreach ($clientAcceptTypes as $type => $quality) {
            if (in_array($type, $supportedTypes)) {
                return $type;
            }
        }
        // Could not satisfy the supported types
        return null;
    }
    
    private function outputBody () {
        // Set up the globals used for the view execution
        $miogen = &$this->miogen;
        $data = &$this->document;
                
        if (is_null($this->viewName)) {
//            // Removed because the HTML renderer is not yet complete
//            if ($this->contentType == 'text/html') { // Temp render to HTML
//                require(dirname(__FILE__) . '/views/html.php');
//            }
            if ($this->contentType == 'vnd.miogen+json') {
                // Render the body if there is one
                if (isset($this->document)) {
                    print(json_encode($this->document->getDocument()));
                }
            }
        }
        else {
            require($this->miogen->getConfig('viewPath') . $this->viewName . '.php');
        }
    }
    
    private function outputHeaders () {
        if (!in_array($this->contentType, array('text/html', 'vnd.miogen+json'))) {
            header('HTTP/1.1 415 Unsupported Media Type');
        }
        else {
            header('HTTP/1.1 ' . $this->statusCode . ' ' . $this->getStatusMessage());
            header('Content-Type: ' . $this->getContentType());
            foreach ($this->headers as $key => $value) {
                header($key . ': ' . $value);
            }
        }
    }

    public function setDocument(&$document) {
        $this->document = &$document;
    }
    
    public function &getDocument () {
        return $this->document;
    }
    
    private function getStatusMessage() {
        switch ($this->statusCode) {
            case 100: return 'Continue';
            case 101: return 'Switching Protocols';
            case 200: return 'OK';
            case 201: return 'Created';
            case 202: return 'Accepted';
            case 203: return 'Non-Authoritative Information';
            case 204: return 'No Content';
            case 205: return 'Reset Content';
            case 206: return 'Partial Content';
            case 300: return 'Multiple Choices';
            case 301: return 'Moved Permanently';
            case 302: return 'Found';
            case 303: return 'See Other';
            case 304: return 'Not Modified';
            case 305: return 'Use Proxy';
            case 307: return 'Temporary Redirect';
            case 400: return 'Bad Request';
            case 401: return 'Unauthorized';
            case 402: return 'Payment Required';
            case 403: return 'Forbidden';
            case 404: return 'Not Found';
            case 405: return 'Method Not Allowed';
            case 406: return 'Not Acceptable';
            case 407: return 'Proxy Authentication Required';
            case 408: return 'Request Timeout';
            case 409: return 'Conflict';
            case 410: return 'Gone';
            case 411: return 'Length Required';
            case 412: return 'Precondition Failed';
            case 413: return 'Request Entity Too Large';
            case 414: return 'Request-URI Too Long';
            case 415: return 'Unsupported Media Type';
            case 416: return 'Request Range Not Satisfiable';
            case 417: return 'Expectation Failed';
            case 500: return 'Internal Server Error';
            case 501: return 'Not Implemented';
            case 502: return 'Bad Gateway';
            case 503: return 'Service Unavailable';
            case 504: return 'Gateway Timeout';
            case 505: return 'HTTP Version Not Supported';
            default: return '';
        }
    }
    
    public function renderDocument() {
        header('HTTP/1.1 ' . $this->statusCode . ' ' . $this->getStatusMessage());
        if (!is_null($this->document)) {
            header('Content-Type: ' . $this->document->getContentType());
            
            $doc = $this->document->getDocument();
            print(str_replace('\/', '/', json_encode($doc)));
        }
    }
}
?>