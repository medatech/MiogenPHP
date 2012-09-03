Miogen.require(['Component.BaseComponent',
                'Component.Textbox',
                'Component.ComboBox'], function () {
    
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
            label = $('<label></label>');
            label.text(this.data.getPrompt());
            this.el.append(label);
            
            dataType = this.data.getType();
            switch (dataType) {
                case 'text': {
                    this.field = new Miogen.Component.Textbox({
                        value: this.data.getValue()
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
            
            Miogen.bind(this.field, 'onChange', function (value) {
                t.onChange(value);
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
        
        onChange: function (value) {
            
        }
        
    }));
    
});