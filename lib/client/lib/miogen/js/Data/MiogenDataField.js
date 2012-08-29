Miogen.define('Data.MiogenDataField', Class.extend({
    
    id: null,
    fieldData: null,
    fieldTemplate: null,
    
    construct: function (id, fieldData, fieldTemplate) {
        this.id = id;
        this.fieldData = fieldData;
        this.fieldTemplate = fieldTemplate;
    },
    
    getID: function () {
        return this.id;
    },
    
    get: function (attributeQuery, /* optional */ defaultValue) {
        var value;
        
        if (typeof (defaultValue) === 'undefined') {
            defaultValue = null;
        }
        
        value = Miogen.queryObject(this.fieldData, attributeQuery, null);
        if (value === null && this.fieldTemplate !== null) {
            // Try the template
            value = Miogen.queryObject(this.fieldTemplate, attributeQuery, null);
        }
        
        if (value === null) {
            value = defaultValue;
        }
        
        return value;
    },
    
    getPrompt: function () {
        return this.get('prompt');
    },
    
    getValue: function () {
        var value = this.get('value');
        if (value === null) {
            value = this.get('defaultValue');
        }
        return value;
    },
    
    getType: function () {
        return this.get('type');
    },
    
    getQuery: function () {
        return this.get('query');
    },
    
    getPromptField: function () {
        return this.get('promptField');
    }
}))