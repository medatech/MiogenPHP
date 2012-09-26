Miogen.define('ViewModel.BaseViewModel', Class.extend({

    config: null,
    
    itemCache: null,
    
    construct: function (cfg) {
        this.config = cfg;
        this.itemCache = {};
    },
    
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