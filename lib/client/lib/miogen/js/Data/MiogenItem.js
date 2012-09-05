Miogen.require(['Data.MiogenDataField'], function () {
    Miogen.define('Data.MiogenItem', Class.extend({
    
        item: null,
        template: null,
        originalValues: null,
        dirty: false,

        construct: function (item, template) {
            this.item = item.item;
            this.template = template;
            this.originalValues = {};
        },
        
        getUri: function () {
            return this.item.href;
        },
        
        get: function (attributeQuery, /* optional */ defaultValue) {
            return Miogen.queryObject(this.item.data, attributeQuery, defaultValue);
        },
        
        set: function (attributeQuery, value) {
            var currentValue = this.get(attributeQuery);
            
            // Only set the value if it's different
            if (currentValue !== value) {
                // Store the original value if we haven't done so already so we
                // can track the changes and revert it later
                if (!this.originalValues.hasOwnProperty(attributeQuery)) {
                    this.originalValues[attributeQuery] = this.get(attributeQuery);
                }
                else {
                    // See if the value is being set back to the original
                    if (this.originalValues[attributeQuery] === value) {
                        delete this.originalValues[attributeQuery];
                    }
                }
                
                Miogen.setObjectValue(this.item.data, attributeQuery, value);
                
                this.onValueChange(attributeQuery, value);
                
                // Refresh the dirty state
                this.refreshDirty();
            }
        },
        
        onValueChange: function (attribute, value) {},
        
        revert: function () {
            var attribute;
            
            // Put back all the original values
            for (attribute in this.originalValues) {
                if (this.originalValues.hasOwnProperty(attribute)) {
                    this.set(attribute, this.originalValues[attribute]);
                }
            }
            
            this.originalValues = {};
            if (this.dirty) {
                this.setDirtyFlag(false);
            }
        },
        
        refreshDirty: function () {
            var attribute, dirty = false;
            
            // Put back all the original values
            for (attribute in this.originalValues) {
                if (this.originalValues.hasOwnProperty(attribute)) {
                    dirty = true;
                    break;
                }
            }
            
            // See if it's different, and if so, set it
            if (this.dirty !== dirty) {
                this.setDirtyFlag(dirty);
            }
        },
        
        setDirtyFlag: function (isDirty) {
            this.dirty = isDirty;
        },
        
        isDirty: function () {
            return this.dirty;
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
                return new Miogen.Data.MiogenDataField(attributeQuery, attributeQuery, this, templateData);
            }
        },
        
        exportDelta: function () {
            var attribute, delta = {};
            
            for (attribute in this.originalValues) {
                if (this.originalValues.hasOwnProperty(attribute)) {
                    Miogen.setObjectValue(delta, attribute, this.get(attribute));
                }
            }
            
            return delta;
        },
        
        commit: function () {
            // Clear the original values object
            this.originalValues = {};
            this.setDirtyFlag(false);
        },
        
        rollback: function () {
            var attribute;
            
            // Go through each of the original values and set it back into the object
            for (attribute in this.originalValues) {
                if (this.originalValues.hasOwnProperty(attribute)) {
                    this.set(attribute, this.originalValues[attribute]);
                }
            }
        }
    }));
});