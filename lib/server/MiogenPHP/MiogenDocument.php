<?php

require_once('MiogenItem.php');
require_once('MiogenTemplate.php');

class MiogenDocument {
    var $collection = array('collection' => array());
    var $col = null;
    var $isCollection = true;
    var $collectionTemplate = null;
    var $itemName = null;
    
    public function __construct ($uri, $isCollection = true) {
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
}
?>