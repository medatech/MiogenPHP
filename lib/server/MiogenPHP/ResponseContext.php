<?php

class ResponseContext {
    
    var $miogen = null;
    var $statusCode = 0;
    var $errors = array();
    var $headers = array();
    var $viewName = null;
    var $responseData = null;
    var $document = null;
    
    public function __construct (&$miogen) {
        $this->miogen = &$miogen;
    }
    
    public function &getMiogen() {
        return $this->miogen;
    }
    
    public function setStatusCode ($code) {
        $this->statusCode = $code;
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
    
    public function setResponseData (&$data) {
        $this->responseData = &$data;
    }
    
    public function render () {
        $this->outputHeaders();
        $this->outputBody();
    }
    
    private function outputBody () {
        // Set up the globals used for the view execution
        $miogen = &$this->miogen;
        $data = &$this->responseData;
                
        if (is_null($this->viewName)) {
            // TODO: See what content type the response must be
            
            $contentType = 'vnd.miogen+JSON';
            if ($contentType != 'vnd.miogen+JSON' || isset($_REQUEST['html'])) { // Temp render to HTML

                require(dirname(__FILE__) . '/views/html.php');
            }
            elseif (isset($this->responseData)) {
                print(json_encode($this->responseData->getDocument(), JSON_PRETTY_PRINT + JSON_UNESCAPED_SLASHES));
            } 
        }
        else {
            require($this->miogen->getConfig('viewPath') . $this->viewName . '.php');
        }
    }
    
    private function outputHeaders () {
        foreach ($this->headers as $key => $value) {
            header($key, $value);
        }
    }

    public function setDocument(&$document) {
        $this->document = &$document;
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
