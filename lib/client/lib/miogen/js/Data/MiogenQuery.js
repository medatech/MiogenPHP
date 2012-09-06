Miogen.require(['Data.MiogenDataField'], function () {

    Miogen.define('Data.MiogenQuery', Class.extend({

        queryData: null,

        construct: function (queryData) {
            this.queryData = queryData;
        },

        getName: function () {
            return this.queryData.name || null;
        },
        
        getRel: function () {
            return this.queryData.rel || null;
        },
        
        getMethod: function () {
            return this.queryData.method || 'GET';
        },
        
        get: function (attributeQuery, /* optional */ defaultValue) {
            return Miogen.queryObject(this.queryData.data, attributeQuery, defaultValue);
        },
        
        getDataFields: function () {
            var field, fields = [];
            for (field in this.queryData.data){
                if (this.queryData.data.hasOwnProperty(field)) {
                    fields.push(new Miogen.Data.MiogenDataField(field, field, this, null));
                }
            }
            return fields;
        },
        
        getDataFieldByRel: function (rel) {
            var field;
            for (field in this.queryData.data){
                if (this.queryData.data.hasOwnProperty(field)) {
                    if (this.queryData.data[field].hasOwnProperty('rel') &&
                        this.queryData.data[field].rel === rel) {
                        return new Miogen.Data.MiogenDataField(field, field, this, null);
                    }
                }
            }
            return null;
        }
    }));
});