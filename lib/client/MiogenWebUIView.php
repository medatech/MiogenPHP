<!DOCTYPE html>
<html>
    <head>
        <title>Loading...</title>
        <script type="text/javascript" src="<?php print($data['miogenUrl']); ?>/lib/class/class.js"></script>
        <script type="text/javascript" src="<?php print($data['miogenUrl']); ?>/lib/jqueryui/js/jquery-1.8.0.min.js"></script>
        <script type="text/javascript" src="<?php print($data['miogenUrl']); ?>/lib/jqueryui/js/jquery-ui-1.8.23.custom.min.js"></script>
        <script type="text/javascript" src="<?php print($data['miogenUrl']); ?>/lib/uri/URI.js"></script>
        <link rel="stylesheet" type="text/css" href="<?php print($data['miogenUrl']); ?>/lib/jqueryui/css/cupertino/jquery-ui-1.8.23.custom.css"></link>

        <link rel="stylesheet" type="text/css" href="<?php print($data['miogenUrl']); ?>/lib/miogen/css/miogen.css"></link>
        <script type="text/javascript" src="<?php print($data['miogenUrl']); ?>/lib/miogen/js/Miogen.js"></script>
        <script type="text/javascript">
            Miogen.setConfig(<?php print(json_encode($data)); ?>);
            
            Miogen.init(function () {
                Miogen.renderTo($('#view-body'));
                Miogen.run();
//                Miogen.require(['Data.MiogenModel'], function () {
//                    
//                });
            });
        </script>
    </head>
    <body>
        <div id="view-body" style="height: 100%"></div>
    </body>
</html>