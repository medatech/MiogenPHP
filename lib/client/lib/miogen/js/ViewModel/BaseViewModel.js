Miogen.define('ViewModel.BaseViewModel', Class.extend({

    cfg: null,
    
    itemCache: null,
    
    construct: function (cfg) {
        this.cfg = cfg;
        this.itemCache = {};
    },
    
//    bind: function (who, /* Array|String */ keys, cb) {
//        var t = this;
//        
//        if (typeof (keys) === 'string') {
//            keys = [keys];
//        }
//        
//        $.each(keys, function (index, key) {
//            var cacheItem;
//            
//            console.log('Widget binding to ' + key);
//
//            cacheItem = t.itemCache[key];
//            if (typeof (cacheItem) === 'undefined') {
//                cacheItem = {
//                    item: null,
//                    watchers: [{
//                        who: who,
//                        cb: cb
//                    }]
//                };
//                t.itemCache[key] = cacheItem;
//            }
//            else {
//                // Add the watcher
//                cacheItem.watchers.push({
//                    who: who,
//                    cb: cb
//                });
//            }
//        });
//    },
    
    set: function (key, value) {
        var existingItem;
        
        existingItem = this.itemCache[key];
        if (typeof (existingItem) === 'undefined') {
            existingItem = {
                item: value,
                watchers: []
            };
            this.itemCache[key] = existingItem;
        }
        else {
            existingItem.value = value;
        }
        
        // Notify all the watchers
        $.each(existingItem.watchers, function (index, watcher) {
            watcher.cb(key, value);
        });
    }


}));