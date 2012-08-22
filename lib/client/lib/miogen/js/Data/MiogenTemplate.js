Miogen.require(['Data.MiogenDataField'], function () {

    Miogen.define('Data.MiogenTemplate', Class.extend({

        template: null,

        construct: function (template) {
            this.template = template;
        },

        getName: function () {
            return this.template.name || null;
        },

        get: function (attributeQuery, /* optional */ defaultValue) {
            return Miogen.queryObject(this.template.data, attributeQuery, defaultValue);
        },
        
        getDataFields: function () {
            var field, fields = [];
            for (field in this.template.data){
                if (this.template.data.hasOwnProperty(field)) {
                    fields.push(new Miogen.Data.MiogenDataField(field, this.template.data[field]));
                }
            }
            return fields;
        }
    }));
});