Miogen.require(['Component.BaseComponent'], function () {
    
    Miogen.define('Component.ComboBox', Miogen.Component.BaseComponent.extend({
        
        options: null,
        
        construct: function (cfg) {
            var config = {
                query: null,
                value: '',
                disabled: false,
                options: []
            }
            
            Miogen.mixIn(config, cfg);
            
            this.options = cfg.options;
            
            this._super(config);
        },
        
        build: function (cb) {
            var t = this;
            
            this.el = $('<select></select>');
            if (this.config.disabled) {
                this.el.prop('disabled', true);
            }
            
            this.el.change(function () {
                t.onChange($(this).val());
            });
            
            if (this.config.value === null) {
                // This needs to be set, so add a blank option
                this.options.unshift({
                    value: null,
                    label: ''
                });
            }
            
            $.each(this.options, function (index, optionData) {
                t.renderOption(optionData);
            });
            cb.call(this);
        },
        
        addOption: function (value, label) {
            var optionData;
            
            optionData = {
                value: value,
                label: label
            };
            this.options.push(optionData);
            
            // Render it if it's a late addition
            if (this.el !== null) {
                this.renderOption(optionData);
            }
        },
        
        renderOption: function (optionData) {
            var option = $('<option></option>');
            option.text(optionData.label);
            option.attr('value', optionData.value);
            this.el.append(option);
            
            // Set the value if this is the selected value
            if (this.config.value === optionData.value) {
                this.setValue(optionData.value);
            }
        },
        
        onChange: function (value) {
            
        },
        
        setValue: function (value) {
            if (this.el !== null) {
                $(this.el).val(value);
            }
            this.config.value = value;
        },
        
        getValue: function () {
            return $(this.el).val();
        }
        
    }));
    
});