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
            this.el = $('<input type="text"></input>');
            this.el.val(this.config.value);
            if (this.config.disabled) {
                this.el.prop('disabled', true);
            }
            cb.call(this);
        }
        
    }));
    
});