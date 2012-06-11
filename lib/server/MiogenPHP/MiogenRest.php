<?php

require_once('RequestContext.php');
require_once('ResponseContext.php');
require_once('MiogenError.php');
require_once('MiogenTrace.php');
require_once('MiogenDictionary.php');
require_once('MiogenRestModule.php');
require_once('MiogenDocument.php');


class MiogenRest {
    private $config = null;
    
    private $configRegexMatches = array();
    
    private $dbMgr = null;
    
    public function __construct ($config) {
        $this->config = $config;
        $this->configRegexMatches = array();
                
        // Make sure there is the urls array
        if (!isset($this->config['urls'])) {
            $this->config['urls'] = array();
        }
        
        // Make sure a controller path is set
        if (!isset($this->config['controllerPath'])) {
            $this->config['controllerPath'] = dirname(__FILE__) . DIRECTORY_SEPARATOR;
        }
        
        // Make sure the module path ends in a slash
        if (substr($this->config['controllerPath'], -1) != DIRECTORY_SEPARATOR) {
            $this->config['controllerPath'] .= DIRECTORY_SEPARATOR;
        }
        
        // Make sure a view path is set
        if (!isset($this->config['viewPath'])) {
            $this->config['viewPath'] = dirname(__FILE__) . DIRECTORY_SEPARATOR;
        }
        
        // Make sure the view path ends in a slash
        if (substr($this->config['viewPath'], -1) != DIRECTORY_SEPARATOR) {
            $this->config['viewPath'] .= DIRECTORY_SEPARATOR;
        }
    }
    
    public function getConfig ($key, $default='') {
        if (isset($this->config[$key])) {
            return $this->config[$key];
        }
        else {
            return $default;
        }
    }
    
    /**
    * Process the URL request as a Rest request
    *
    * @return ResponseContext
    */
    public function &process ($url) {
        $request = new RequestContext($this);
        $response = new ResponseContext($this);
        
        $request->setUrl($url);
        // Generate the regular expressions for each of the URLs
        foreach($this->config['urls'] as $moduleUrl => $module) {
            $urlConfig = array(
                'params' => array(),
                'regex' => null,
                'module' => $module
            );
            // Find all the curley braces in it
            $matches = array();
            $result = preg_match_all ('({[a-zA-Z0-9-_]*})' , $moduleUrl, $matches);
            if ($result) {
                for ($i = 0; $i < count($matches[0]); $i += 1) {
                    // Relpace all curley braches with a pattern matcher
                    $urlConfig['params'][] = substr($matches[0][$i], 1, strlen($matches[0][$i]) - 2);
                    $moduleUrl = str_replace($matches[0][$i], '([a-zA-Z0-9-_]+)', $moduleUrl);
                }
            }
            $urlConfig['regex'] = '~^' . $moduleUrl . '$~';
            
            $this->configRegexMatches[] = $urlConfig;
        }
        
        // Test each one until we find a match
        for ($i = 0; $i < count($this->configRegexMatches); $i += 1) {
            $regex = $this->configRegexMatches[$i]['regex'];
            $matches = array();
            $result = preg_match_all($regex, $url, $matches);
            if ($result) {
                // Get the parameters
                $params = $this->configRegexMatches[$i]['params'];
                for ($j = 0; $j < count($params) && $j < count($matches) - 1; $j += 1) {
                    $request->setParameter($params[$j], $matches[$j+1][0]);
                }
                
                $request->setRestModuleName($this->configRegexMatches[$i]['module']);
            }
        }
        
        // If we could not find a module, return a 404
        if (is_null($request->getRestModuleName())) {
            $response->setStatusCode(404);
        }
        else {
            $this->executeModule($request, $response);
        }
        
        //print('<pre>' . print_r($request, true) . '</pre>');
        //print('<pre>' . print_r($response, true) . '</pre>');

        return $response;
    }
    
    function executeModule (&$request, &$response) {
        $moduleName = $request->getRestModuleName();
        
        $modulePath = $this->config['controllerPath'] . DIRECTORY_SEPARATOR . $moduleName . '.php';

        if (file_exists($modulePath)) {
            require_once($modulePath);
        
            // Instanciate the module
            $module = new $moduleName();
            switch ($request->getMethod()) {
                case 'GET': {
                    $module->doGet($request, $response);
                    break;
                }
                case 'PUT': {
                    $module->doPut($request, $response);
                    break;
                }
                case 'POST': {
                    $module->doPost($request, $response);
                    break;
                }
                case 'DELETE': {
                    $module->doDelete($request, $response);
                    break;
                }
                case 'HEAD': {
                    $module->doHead($request, $response);
                    break;
                }
                default: {
                    $response->addError(new MiogenError(MiogenDictionary::METHOD_NOT_SUPPORTED));
                    $module->addAllowHeader($response);
                }
            }
        }
        else {
            MiogenTrace::log('Could not find file ' . $modulePath . ' when handling URL ' . $request->getUrl());
            $response->setStatusCode(500);
            $response->addError(new MiogenError(MiogenDictionary::MODULE_NOT_FOUND));
            $response->addError(new MiogenError(MiogenDictionary::OTHER_MESSAGE));
        }
    }
}

?>
