Miogen.require(['Component.BaseComponent'], function () {
    
    Miogen.define('Component.ComboBox', Miogen.Component.BaseComponent.extend({
        
        options: null,
        
        construct: function (cfg) {
            var config = {
                query: null,
                value: '',
                disabled: false
            }
            
            Miogen.mixIn(config, cfg);
            
            this.options = [];
            
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
        },
        
        onChange: function (value) {
            
        },
        
        setValue: function (value) {
            $(this.el).val(value);
        },
        
        getValue: function () {
            return $(this.el).val();
        }
        
    }));
    
});