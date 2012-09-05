Miogen.require(['Component.BaseComponent'], function () {
    
    Miogen.define('Component.Label', Miogen.Component.BaseComponent.extend({
        
        construct: function (cfg) {
            var config = {
                text: 'Label',
                visible: true,
                className: null
            }
            
            Miogen.mixIn(config, cfg);
            
            this._super(config);
        },
    
        build: function (cb) {
            this.el = $('<span></span>');
            this.el.text(this.config.text);
            if (this.config.className !== null) {
                this.el.addClass(this.config.className);
            }
            if (!this.config.visible) {
                this.el.addClass('hidden');
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
        },
        
        show: function () {
            this.config.visible = true;
            
            if (this.el !== null) {
                this.el.removeClass('hidden');
            }
        },
        
        hide: function () {
            this.config.visible = false;
            
            if (this.el !== null) {
                this.el.addClass('hidden');
            }
        }
        
    }));
    
});