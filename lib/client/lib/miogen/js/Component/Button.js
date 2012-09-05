Miogen.require(['Component.BaseComponent'], function () {
    
    Miogen.define('Component.Button', Miogen.Component.BaseComponent.extend({
        
        construct: function (cfg) {
            var config = {
                label: 'Button',
                disabled: false
            }
            
            Miogen.mixIn(config, cfg);
            
            this._super(config);
        },
    
        build: function (cb) {
            this.el = $('<button></button>');
            this.el.text(this.config.label);
            if (this.config.disabled) {
                this.el.prop('disabled', true);
            }
            if (this.config.click) {
                this.el.click(this.config.click);
            }
            cb.call(this);
        },
        
        setLabel: function (label) {
            this.config.label = label;
            
            if (this.el !== null) {
                this.el.text(label);
            }
        }
        
    }));
    
});