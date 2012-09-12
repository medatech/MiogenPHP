Miogen.require(['Component.BaseComponent'], function () {
    
    Miogen.define('Component.Checkbox', Miogen.Component.BaseComponent.extend({
        
        construct: function (cfg) {
            var config = {
                label: 'Checkbox',
                checked: false,
                disabled: false
            }
            
            Miogen.mixIn(config, cfg);
            
            this._super(config);
        },
    
        build: function (cb) {
            var t = this;
            this.el = $('<div class="checkbox"><label><input type="checkbox"' + (this.config.checked ? ' checked' : '') + '><span></span></label></div>');
            $('label span', this.el).text(this.config.label);
            if (this.config.disabled) {
                $('input', this.el).prop('disabled', true);
            }
            
            $('input', this.el).change(function () {
                t.onChange(t.getValue());
            });
            cb.call(this);
        },
        
        setLabel: function (label) {
            this.config.label = label;
            
            if (this.el !== null) {
                $('label span', this.el).text(label);
            }
        },
        
        getValue: function () {
            return $('input', this.el).is(':checked');
        },
        
        setValue: function (value) {
            if (this.el !== null) {
                $('input', this.el).prop('checked', value === true);
            }
            this.config.value = value;
        },
        
        onChange: function (value) {}
    }));
    
});