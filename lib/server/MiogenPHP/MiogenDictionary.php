<?php
require_once('dictionary/fr.php');

$localisedMiogenDictionaryClass = 'MiogenDictionary_en';
eval('class MiogenDictionary extends ' . $localisedMiogenDictionaryClass . ' {}');
?>
