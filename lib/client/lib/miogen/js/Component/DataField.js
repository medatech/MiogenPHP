Miogen.require(['Component.BaseComponent',
                'Component.Textbox',
                'Component.ComboBox',
                'Component.Checkbox'], function () {
    
    Miogen.define('Component.DataField', Miogen.Component.BaseComponent.extend({
        
        field: null,
        overrideDefaultCheckbox: null,
        data: null,
        
        construct: function (cfg) {
            var config = {
                data: null
            };
            
            Miogen.mixIn(config, cfg);
            
            this.data = cfg.data;
            
            this._super(config);
        },
    
        build: function (cb) {
            var label, t = this, dataType, dataQuery, required, localValue;
            
            this.el = $('<div class="data-field"></div>');
            required = this.data.isRequired();
            dataType = this.data.getType();
            
            if (dataType !== 'boolean' || !required) {
                // Checkboxes doesn't have separate labels as it's in the control
                label = $('<label></label>');
                label.text(this.data.getPrompt());
                this.el.append(label);
            }
            
            // If it's not a boolean and not required, set the override default checkbox
            if (dataType !== 'boolean' && !required) {
                this.overrideDefaultCheckbox = new Miogen.Component.Checkbox({
                    label: 'Override default',
                    checked: this.data.getValue() !== null
                });
                this.addComponent(this.overrideDefaultCheckbox);
            }
            
            switch (dataType) {
                case 'boolean': {
                    if (required) {
                        this.field = new Miogen.Component.Checkbox({
                            label: this.data.getPrompt(),
                            checked: this.data.getValue()
                        });
                    }
                    else {
                        // It's not required, so we have 3 states, Default, Yes, No
                        this.field = new Miogen.Component.ComboBox({
                            value: this.data.getValue() === null ? '' : (this.data.getValue() ? 'true' : 'false'), // Null means Default
                            options: [
                                {value: '', label: 'Default (' + (this.data.getInheritedValue(false) ? 'Yes' : 'No') + ')'},
                                {value: 'true', label: 'Yes'},
                                {value: 'false', label: 'No'}
                            ]
                        });
                    }
                    break;
                }
                case 'text': {
                    this.field = new Miogen.Component.Textbox({
                        value: this.data.getValue(),
                        disabled: this.data.isReadOnly()
                    });
                    break;
                }
                case 'numeric': {
                    // TODO: Use a number stepper and have numeric validation
                    this.field = new Miogen.Component.Textbox({
                        value: this.data.getValue(),
                        disabled: this.data.isReadOnly()
                    });
                    break;
                }
                case 'uri': {
                    this.field = new Miogen.Component.ComboBox({
                        value: this.data.getValue()
                    });
                    break;
                }
                default: {
                    this.field = new Miogen.Component.Textbox({
                        value: this.data.getValue(),
                        disabled: true
                    });
                }
            }
            
            Miogen.bind(t, this.field, 'onChange', function (value) {
                if (dataType === 'boolean' && !required) {
                    // It can be null, true, false
                    if (value === '') {
                        value = null;
                    }
                    else {
                        value = value === 'true';
                    }
                }
                localValue = value;
                t.data.setValue(value);
            });
            
            // Watch for changes to the field
            Miogen.bind(t, this.data.getItem(), 'onValueChange', function (attribute, value) {
                if (attribute === t.data.getAttribute() + '.value') {
                    if (dataType === 'boolean' && !required) {
                        // Handle the special case for booleans
                        if (value === null) {
                            value = '';
                        }
                        else {
                            value = value ? 'true' : 'false';
                        }
                    }
                    
                    // If we have an override checkbox, make sure that is enabled before we update the display value
                    if (t.overrideDefaultCheckbox !== null) {
                        if (value === null && t.overrideDefaultCheckbox.getValue() === true) {
                            t.overrideDefaultCheckbox.setValue(false); // We are going back to the not overriding
                            t.field.disable();
                            t.field.setValue(t.data.getInheritedValue());
                        }
                        else {
                            if (value !== null && !t.overrideDefaultCheckbox.getValue()) {
                                // We are overriding the value
                                t.field.enable();
                                t.overrideDefaultCheckbox.setValue(true);
                            }
                            
                            // Only set the value if it's different and is not null (as the text box value will be the inherited one)
                            if (t.field.getValue() !== value && (t.overrideDefaultCheckbox.getValue() !== false && value !== null)) {
                                t.field.setValue(value);
                            }
                        }
                    }
                    else {
                        if (t.field.getValue() !== value) {
                            t.field.setValue(value);
                        }
                    }
                }
            });
            
            // Bind to the override default checkbox to set the real data field to the appropriate states
            if (this.overrideDefaultCheckbox !== null) {
                localValue = this.data.getValue();
                if (this.data.getValue() === null) {
                    // Disable the field
                    this.field.disable();
                    this.field.setValue(t.data.getInheritedValue());
                }
                
                Miogen.bind(t, this.overrideDefaultCheckbox, 'onChange', function (value) {
                    if (value) {
                        if (localValue === null) {
                            localValue = t.data.getDefaultValue(''); // Get the default value
                        }
                        
                        t.field.enable();
                        t.field.setValue(localValue);
                        t.data.setValue(localValue);
                    }
                    else {
                        t.field.disable();
                        t.field.setValue(t.data.getInheritedValue());
                        t.data.setValue(null);
                    }
                });
            }
            
            this.addComponent(this.field);
            
            // See if we need to load the data
            dataQuery = this.data.getQuery();
            if (dataQuery !== null) {
                // Lookup the data
                Miogen.getViewModel().get({
                    url: dataQuery,
                    success: function (doc) {
                        $.each(doc.getItems(), function (index, item) {
                            t.field.addOption(item.getUri(), item.getField(t.data.getPromptField()).getValue());
                        });
                        
                        t.field.build(function () {
                            cb.call(t);
                        });
                    },
                    error: function () {
                        console.log('Unable to load data', arguments);
                    }
                });
            }
            else {
                // No query lookup, just build it
                this.field.build(function () {
                    if (t.overrideDefaultCheckbox !== null) {
                        t.overrideDefaultCheckbox.build(function () {
                            cb.call(t);
                        });
                    }
                    else {
                        cb.call(t);
                    }
                });
            }
        },
        
        destroy: function () {
            Miogen.unbind(this, this.field, 'onChange');
            Miogen.unbind(this, this.data.getItem(), 'onValueChange');
            this._super();
        }
        
    }));
    
});