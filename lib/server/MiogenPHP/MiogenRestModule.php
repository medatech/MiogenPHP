<?php

class MiogenRestModule {
    function MiogenRestModule() {
        
    }
    
    public function doGet(&$request, &$response) {
        $response->addError(new MiogenError(MiogenDictionary::METHOD_NOT_SUPPORTED));
        $this->addAllowHeader($response);
    }
    
    public function doPut(&$request, &$response) {
        $response->addError(new MiogenError(MiogenDictionary::METHOD_NOT_SUPPORTED));
        $this->addAllowHeader($response);
    }
    
    public function doPost(&$request, &$response) {
        $response->addError(new MiogenError(MiogenDictionary::METHOD_NOT_SUPPORTED));
        $this->addAllowHeader($response);
    }
    
    public function doDelete(&$request, &$response) {
        $response->addError(new MiogenError(MiogenDictionary::METHOD_NOT_SUPPORTED));
        $this->addAllowHeader($response);
    }
    
    public function doHead(&$request, &$response) {
        $response->addError(new MiogenError(MiogenDictionary::METHOD_NOT_SUPPORTED));
        $this->addAllowHeader($response);
    }
    
    public function addAllowHeader(&$response) {
        $response->addHeader('Allow', implode(', ', $this->getSupportedMethods()));
    }
    
    public function getSupportedMethods() {
        return array();
    }
}
?>