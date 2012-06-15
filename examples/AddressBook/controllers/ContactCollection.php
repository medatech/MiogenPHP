<?php

require_once(APP_ROOT . '/../../lib/server/MiogenPHP/MiogenRestModule.php');

class ContactCollection extends MiogenRestModule {
    
    public function getSupportedMethods() {
        return array('GET');
    }
    
    private function &getTemplate () {
        $template = new MiogenTemplate('contact');
        
        $template->addField('id', array(
            'prompt' => 'ID',
            'type' => 'numeric',
            'decimals' => 0,
            'min' => 1,
            'max' => 999999,
            'read-only' => true
        ));
        $template->addField('first-name', array(
            'prompt' => 'First name',
            'type' => 'text',
            'required' => true,
            'min-len' => 1,
            'max-len' => 50
        ));
        $template->addField('last-name', array(
            'prompt' => 'Last name',
            'type' => 'text',
            'required' => true,
            'min-len' => 1,
            'max-len' => 50
        ));
        $template->addField('email', array(
            'prompt' => 'Email address',
            'type' => 'email',
            'required' => true,
            'min-len' => 1,
            'max-len' => 100
        ));
        $template->addField('address', array(
            'prompt' => 'Address',
            'type' => 'query',
            'query-name' => 'address',
            'required' => true,
            'min-cardinality' => 1,
            'max-cardinality' => 1
        ));
        
        return $template;
    }
    
    public function doGet(&$request, &$response) {
        $root = $request->getMiogen()->getConfig('resourceRoot');
        
        $doc = new MiogenDocument($root);
        $doc->setPrompt('Contacts');
        $doc->setItemName('contact');
        
        $doc->addLink($root . '/API/');
        
        // Add the collection template
        $doc->addTemplate($this->getTemplate(), true);

        $response->setResponseData($doc);
        $response->setStatusCode(200);
    }
    
}
?>