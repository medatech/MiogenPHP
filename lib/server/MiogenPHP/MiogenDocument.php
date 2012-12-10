<?php

require_once('MiogenItem.php');
require_once('MiogenTemplate.php');
require_once('MiogenQuery.php');
require_once('TemplateValidator.php');
require_once('DataMixin.php');

class MiogenDocument {
    var $collection = array('collection' => array());
    var $col = null;
    var $isCollection = true;
    var $collectionTemplate = null;
    var $itemName = null;
    
    public function __construct ($uri = null, $isCollection = true) {
        $this->col = &$this->collection['collection'];
        $this->col['href'] = $uri;
        $this->col['version'] = '1.0';
        $this->isCollection = $isCollection;
    }
    
    public function isCollection () {
        return $this->isCollection;
    }
    
    public function setItemName ($itemName) {
        $this->itemName = $itemName;
    }
    
    public function getItemName () {
        return $this->itemName;
    }
    
    public function setPrompt ($prompt) {
        $this->col['prompt'] = $prompt;
    }
    
    public function getPrompt () {
        if (isset($this->col['prompt'])) {
            return $this->col['prompt'];
        }
        else {
            return '';
        }
    }
    
    public function getHref() {
        return $this->col['href'];
    }
    
    public function getContentType() {
        return 'application/vnd.miogen+JSON';
    }
    
    public function addLink($href, $rel = null, $prompt = null) {
        $link = array('href' => $href);
        if (!is_null($rel)) {
            $link['rel'] = $rel;
        }
        if (!is_null($prompt)) {
            $link['prompt'] = $prompt;
        }
        
        if (!isset($this->col['links'])) {
            $this->col['links'] = array($link);
        }
        else {
            $this->col['links'][] = $link;
        }
    }
    
    public function getLinks () {
        if (isset($this->col['links'])) {
            return $this->col['links'];
        }
        else {
            return array();
        }
    }
    
    public function getDocument() {
        return $this->collection;
    }
    
    public function addItem(&$item) {
        if (!isset($this->col['items'])) {
            $this->col['items'] = array(&$item);
        }
        else {
            $this->col['items'][] = &$item;
        }
    }
    
    public function getItems () {
        if (isset($this->col['items'])) {
            return $this->col['items'];
        }
        else {
            return array();
        }
    }
    
    public function &getItem ($index = 0) {
        if (isset($this->col['items']) && count($this->col['items']) > $index) {
            return $this->col['items'][$index];
        }
        else {
            $null = null;
            return $null;
        }
    }
    
    public function addQuery(&$query) {
        if (!isset($this->col['queries'])) {
            $this->col['queries'] = array(&$query);
        }
        else {
            $this->col['queries'][] = &$query;
        }
    }
    
    public function addTemplate(&$template, $collectionTemplate = false) {
        if (!isset($this->col['templates'])) {
            $this->col['templates'] = array(&$template);
        }
        else {
            $this->col['templates'][] = &$template;
        }
        
        if ($collectionTemplate) {
            $this->collectionTemplate = &$template;
        }
    }
    
    public function getTemplates () {
        if (isset($this->col['templates'])) {
            return $this->col['templates'];
        }
        else {
            return array();
        }
    }
    
    public function &getCollectionTemplate () {
        return $this->collectionTemplate;
    }
    
    public function addStaleCollection ($uri) {
        if (!isset($this->col['staleCollections'])) {
            $this->col['staleCollections'] = array();
        }
        
        $this->col['staleCollections'][] = array(
            'href' => $uri
        );
    }
    
    public function setTotalCount ($count) {
        $this->col['totalCount'] = $count;
    }
    
    public function setStartIndex ($index) {
        $this->col['startIndex'] = $index;
    }
    
    public function addErrors ($errors) {
        foreach ($errors as $error) {
            $this->addError($error);
        }
    }
    
    public function addError ($error) {
        if (!isset($this->col['errors'])) {
            $this->col['errors'] = array();
        }
        $this->col['errors'][] = $error;
    }
    
    public function hasErrors () {
        if (isset($this->col['errors'])) {
            return count($this->col['errors']) > 0;
        }
        else {
            return false;
        }
    }
    
    /**
     * Validate and apply the data to the collection item
     * @param type $userData
     * @param type $template
     * @param type $setDefaults
     */
    public function &apply ($userData, $template, $setDefaults) {
        
        $returnData = null;
        $validator = new TemplateValidator($template);
        if (!$validator->validate($userData)) {
            $this->addErrors($validator->getErrors());
        }
        else {
            $item = new MiogenItem(null);
            
            // Mix in the user data
            $mixedData = array();
            $mixUserData = isset($userData['data']) ? $userData['data'] : array();
            $templateData = $template->getFields();
            DataMixin::mixin($mixedData, $mixUserData, $templateData, $setDefaults);
            
            // Set the mixed data to the item
            $item->setData($mixedData);
            
            $this->addItem($item);
            $returnData = &$item;
        }
        
        return $returnData;
    }
}
?>