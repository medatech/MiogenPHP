Miogen.require(['Data.MiogenModel', 'Data.MiogenDocument'], function () {
    Miogen.define('Data.MiogenStore', Class.extend({

        cfg: null,
        pendingGets: null,
        model: null,
        
        construct: function (cfg) {
            this.cfg = cfg;
            this.pendingGets = {};
            this.model = new Miogen.Data.MiogenModel();
        },

        /**
         * Gets a Miogen collection object
         * @param cfg The config object
         *      url String  The URI of hte item to get
         *      success Function  The callback to call when the item has successfully been retrieved
         *          (MiogenCollection|MigoenItem)
         *      error Function  Called when the item cannot be retrieved
         *          (MiogenModel store, XMLHttpRequest ajaxRequest, String errorText)
         *      
         */
        get: function (cfg) {
            var t = this, item;
            
            // Get it from the cache if available
            item = this.model.get(cfg.url);
            if (item === null) {
                // Load it from the server
                
                // See if we are currently waiting for this item
                if (this.pendingGets.hasOwnProperty(cfg.url)) {
                    // It's already pending, so add this to the list of notifications
                    this.pendingGets[cfg.url].push(cfg);
                }
                else {
                    // Create this as a pending get
                    this.pendingGets[cfg.url] = [cfg];
                    
                    $.ajax({
                        url: cfg.url,
                        headers: {
                            'Accept': 'vnd.miogen+JSON'
                        },
                        contentType: 'text/json',
                        success: function (data) {
                            var item = t.model.set(data);
                            item._doc = new Miogen.Data.MiogenDocument(item);
                            
                            // Call all the pending notifications
                            $.each(t.pendingGets[cfg.url], function (index, notifyCfg) {
                                // Notify on the next tick so we can delete the pending request safely
                                setTimeout(function () {
                                    notifyCfg.success.call(t, item._doc);
                                }, 0);
                            });
                            // Clear the item in the pending list
                            delete (t.pendingGets[cfg.url]);
                        },
                        error: function (xhr, text, error) {
                            // Call all the pending notifications
                            $.each(t.pendingGets[cfg.url], function (index, notifyCfg) {
                                // Notify on the next tick so we can delete the pending request safely
                                setTimeout(function () {
                                    notifyCfg.error.call(t, xhr, text, error);
                                }, 0);
                            });
                            // Clear the item in the pending list
                            delete (t.pendingGets[cfg.url]);
                        }
                    });
                } // End of if already requested and waiting for a response
            } // End of loading from the server
            else {
                if (!item.hasOwnProperty('_doc')) {
                    item._doc = new Miogen.Data.MiogenDocument(item);
                }
                // Got it, just return it
                cfg.success(item._doc);
            }
        },
        
        put: function (cfg) {
            
            var saveData = {
                data: cfg.doc.getItem(0).exportDelta()
            };
            
            $.ajax({
                url: cfg.doc.getUri(),
                headers: {
                    'Accept': 'vnd.miogen+JSON'
                },
                contentType: 'text/json',
                type: 'PUT',
                processData: false,
                data: JSON.stringify(saveData),
                success: function (data) {
                    console.log('PUT response', data);
//                    var item = t.model.set(data);
//                    item._doc = new Miogen.Data.MiogenDocument(item);
//
//                    // Call all the pending notifications
//                    $.each(t.pendingGets[cfg.url], function (index, notifyCfg) {
//                        // Notify on the next tick so we can delete the pending request safely
//                        setTimeout(function () {
//                            notifyCfg.success.call(t, item._doc);
//                        }, 0);
//                    });
//                    // Clear the item in the pending list
//                    delete (t.pendingGets[cfg.url]);
                },
                error: function (xhr, text, error) {
                    console.log('PUT error', arguments);
                }
            });
            
        }

    }));
});