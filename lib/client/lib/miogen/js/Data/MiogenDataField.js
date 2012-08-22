Miogen.define('Data.MiogenDataField', Class.extend({
    
    id: null,
    field: null,
    
    construct: function (id, field) {
        this.id = id;
        this.field = field;
    },
    
    getID: function () {
        return this.id;
    },
    
    get: function (attributeQuery, /* optional */ defaultValue) {
        return Miogen.queryObject(this.field, attributeQuery, defaultValue);
    }
}))