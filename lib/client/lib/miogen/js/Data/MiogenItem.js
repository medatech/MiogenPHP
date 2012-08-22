Miogen.define('Data.MiogenItem', Class.extend({
    
    item: null,
    
    construct: function (item) {
        this.item = item;
    },
    
    getUri: function () {
        return this.item.href;
    },
    
    get: function (attributeQuery, /* optional */ defaultValue) {
        return Miogen.queryObject(this.item.data, attributeQuery, defaultValue);
    }
}))