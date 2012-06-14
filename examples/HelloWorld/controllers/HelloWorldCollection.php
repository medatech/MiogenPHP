<?php

require_once(APP_ROOT . '/../../lib/server/MiogenPHP/MiogenRestModule.php');

class HelloWorldCollection extends MiogenRestModule {
    
    public function getSupportedMethods() {
        return array('GET');
    }
    
    private function &getTemplate () {
        $template = new MiogenTemplate('message');
        
        $template->addField('id', array(
            'prompt' => 'ID',
            'type' => 'numeric',
            'decimals' => 0,
            'min' => 1,
            'max' => 999999,
            'read-only' => true
        ));
        $template->addField('message', array(
            'prompt' => 'Message',
            'type' => 'text',
            'required' => true,
            'min-len' => 1,
            'max-len' => 255
        ));
        $template->addField('language', array(
            'prompt' => 'Language',
            'type' => 'text',
            'required' => true,
            'min-len' => 1,
            'max-len' => 2
        ));
        
        return $template;
    }
    
    public function doGet(&$request, &$response) {
        $root = $request->getMiogen()->getConfig('resourceRoot');
        
        $doc = new MiogenDocument($root);
        $doc->setPrompt('Hello World Messages');
        $doc->setItemName('Message');
        
        $doc->addLink($root . '/API/');
        
        // Add the collection template
        $doc->addTemplate($this->getTemplate(), true);
        
        // Get all the messages
        $doc->addItem(new MiogenItem($root . '/API/HelloWorld/1',
            array(
                'id' => array('value' => 1),
                'message' => array('value' => 'Hello World'),
                'language' => array('value' => 'English')
            )
        ));
        
        $doc->addItem(new MiogenItem($root . '/API/HelloWorld/2',
            array(
                'id' => array('value' => 2),
                'message' => array('value' => 'Hola Mundo'),
                'language' => array('value' => 'Spanish')
            )
        ));
        
        $doc->addItem(new MiogenItem($root . '/API/HelloWorld/3',
            array(
                'id' => array('value' => 3),
                'message' => array('value' => 'Bonjour tout le monde'),
                'language' => array('value' => 'French')
            )
        ));
        
        $doc->addItem(new MiogenItem($root . '/API/HelloWorld/4',
            array(
                'id' => array('value' => 4),
                'message' => array('value' => 'こんにちは世界'),
                'language' => array('value' => 'Japanese')
            )
        ));

        $response->setResponseData($doc);
        $response->setStatusCode(200);
    }
    
}
?>