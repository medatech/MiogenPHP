Miogen.require(['Component.BaseComponent',
                'Component.Textbox',
                'Component.ComboBox',
                'Component.Checkbox'], function () {
    
    Miogen.define('Component.DataField', Miogen.Component.BaseComponent.extend({
        
        field: null,
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
            var label, t = this, dataType, dataQuery;
            
            this.el = $('<div class="data-field"></div>');
            dataType = this.data.getType();
            
            if (dataType !== 'boolean') {
                // Checkboxes doesn't have separate labels as it's in the control
                label = $('<label></label>');
                label.text(this.data.getPrompt());
                this.el.append(label);
            }
            
            switch (dataType) {
                case 'boolean': {
                    this.field = new Miogen.Component.Checkbox({
                        label: this.data.getPrompt(),
                        checked: this.data.getValue()
                    });
                    break;
                }
                case 'text': {
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
                t.data.setValue(value);
            });
            
            // Watch for changes to the field
            Miogen.bind(t, this.data.getItem(), 'onValueChange', function (attribute, value) {
                if (attribute === t.data.getAttribute() + '.value' &&
                    t.field.getValue() !== value) {
                    t.field.setValue(value);
                }
            });
            
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
                    cb.call(t);
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