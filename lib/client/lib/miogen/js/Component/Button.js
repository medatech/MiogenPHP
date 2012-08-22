Miogen.require(['Component.BaseComponent'], function () {
    
    Miogen.define('Component.Button', Miogen.Component.BaseComponent.extend({
        
        construct: function (cfg) {
            var config = {
                label: 'Button'
            }
            
            Miogen.mixIn(config, cfg);
            
            this._super(config);
        },
    
        build: function (cb) {
            this.el = $('<button></button>');
            this.el.text(this.config.label);
            cb.call(this);
        }
        
    }));
    
});