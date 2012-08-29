Miogen.require(['Data.MiogenDataField'], function () {
    Miogen.define('Data.MiogenItem', Class.extend({
    
        item: null,
        template: null,

        construct: function (item, template) {
            this.item = item.item;
            this.template = template;
        },

        getUri: function () {
            return this.item.href;
        },

        get: function (attributeQuery, /* optional */ defaultValue) {
            return Miogen.queryObject(this.item.data, attributeQuery, defaultValue);
        },

        getField: function (attributeQuery) {
            var data, templateData
            
            data = this.get(attributeQuery);
            if (data === null) {
                return null;
            }
            else {
                if (this.template !== null) {
                    templateData = this.template.get(attributeQuery);
                }
                return new Miogen.Data.MiogenDataField(attributeQuery, data, templateData);
            }
        }
    }));
});