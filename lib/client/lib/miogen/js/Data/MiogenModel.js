
Miogen.define('Data.MiogenModel', Class.extend({
    
    cfg: null,
    
    collections: null,
    items: null,
    
    construct: function (cfg) {
        console.log('Creating miogen model');
        this.cfg = cfg;
        this.collections = {};
        this.items = {};
    },
    
    get: function (cfg) {
        var t = this;
        $.ajax({
            url: cfg.url,
            headers: {
                'Accept': 'vnd.miogen+JSON'
            },
            contentType: 'text/json',
            success: function (data) {
                cfg.success.call(t, data);
            },
            error: function (xhr, text, error) {
                cfg.error.apply(t, arguments);
            }
        });
    },
    
    set: function (item, attribute, value) {
        
    },
    
    remove: function (item) {
        
    },
    
    create: function (item) {
        // Not sure how this works as it might need to go inside a collection
    },
    
    save: function (cb) {
        
    },
    
    discard: function () {
        
    }

}));