Miogen.define('Data.MiogenDataField', Class.extend({
    
    id: null,
    attribute: null,
    item: null,
    fieldTemplate: null,
    
    construct: function (id, attribute, /* MiogenItem|MiogenTemplate */ item, fieldTemplate) {
        this.id = id;
        this.attribute = attribute;
        this.item = item;
        this.fieldTemplate = fieldTemplate;
    },
    
    getID: function () {
        return this.id;
    },
    
    /**
     * Gets the relative attribute to the current field
     */
    get: function (attributeQuery, /* optional */ defaultValue) {
        var value;
        
        if (typeof (defaultValue) === 'undefined') {
            defaultValue = null;
        }
        
        // First see if the value is in the item
        value = this.item.get(this.attribute + '.' + attributeQuery, null);
        
        if (value === null && this.fieldTemplate !== null) {
            // Not in the item, so try the tempplate
            value = Miogen.queryObject(this.fieldTemplate, attributeQuery, null);
        }
        
        if (value === null) {
            value = defaultValue;
        }
        
        return value;
    },
    
    set: function (attributeQuery, value) {
        this.item.set(this.attribute + '.' + attributeQuery, value);
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
    
    setValue: function (value) {
        this.set('value', value);
    },
    
    getType: function () {
        return this.get('type');
    },
    
    getQuery: function () {
        return this.get('query');
    },
    
    getPromptField: function () {
        return this.get('promptField');
    },
    
    isReadOnly: function () {
        return this.get('readOnly', false);
    },
    
    getItem: function () {
        return this.item;
    },
    
    getAttribute: function () {
        return this.attribute;
    },
    
    getMax: function (defaultValue) {
        return this.get('max', defaultValue);
    },
    
    getMin: function (defaultValue) {
        return this.get('min', defaultValue);
    },
    
    isRequired: function () {
        return this.get('required', true);
    },
    
    getDefaultValue: function (defaultValue) {
        return this.get('defaultValue', defaultValue);
    },
    
    getInheritedValue: function (defaultValue) {
        return this.get('inheritedValue', defaultValue);
    }
}));