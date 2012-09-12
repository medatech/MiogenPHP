Miogen.require(['Component.BaseComponent'], function () {
    
    Miogen.define('Component.Textbox', Miogen.Component.BaseComponent.extend({
        
        construct: function (cfg) {
            var config = {
                value: '',
                disabled: false
            }
            
            Miogen.mixIn(config, cfg);
            
            this._super(config);
        },
    
        build: function (cb) {
            var t = this;
            this.el = $('<input type="text"></input>');
            this.el.val(this.config.value);
            if (this.config.disabled) {
                this.el.prop('disabled', true);
            }
            this.el.change(function () {
                t.onChange($(this).val());
            });
            this.el.keyup(function () {
                t.onChange($(this).val());
            });
            cb.call(this);
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