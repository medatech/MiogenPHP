Miogen.require(['Data.MiogenDataField'], function () {

    Miogen.define('Data.MiogenTemplate', Class.extend({

        templateData: null,

        construct: function (templateData) {
            this.templateData = templateData;
        },

        getName: function () {
            return this.templateData.template.name || null;
        },

        get: function (attributeQuery, /* optional */ defaultValue) {
            return Miogen.queryObject(this.templateData.template.data, attributeQuery, defaultValue);
        },
        
        getDataFields: function () {
            var field, fields = [];
            for (field in this.templateData.template.data){
                if (this.templateData.template.data.hasOwnProperty(field)) {
                    fields.push(new Miogen.Data.MiogenDataField(field, field, this, null));
                }
            }
            return fields;
        }
    }));
});