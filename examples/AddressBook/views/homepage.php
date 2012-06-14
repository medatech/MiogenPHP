<!DOCTYPE html>
<html>
    <head>
        <title>Miogen PHP Address Book Example</title>
    </head>
    
    <body>
        <h1>Miogen PHP Address Book Example</h1>
        <ul>
            <li><a href="<?php print($miogen->getConfig('resourceRoot')); ?>API/"><?php print($miogen->getConfig('resourceRoot')); ?>API/</a></li>
            <li><a href="<?php print($miogen->getConfig('resourceRoot')); ?>API/Contacts/"><?php print($miogen->getConfig('resourceRoot')); ?>API/Contacts/</a></li>
            <li><a href="<?php print($miogen->getConfig('resourceRoot')); ?>API/Addresses/"><?php print($miogen->getConfig('resourceRoot')); ?>API/Addresses/</a></li>
        </ul>
    </body>
    
</html>