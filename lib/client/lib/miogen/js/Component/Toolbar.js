Miogen.require(['Component.BaseComponent',
                'Component.Button'], function () {
    
    Miogen.define('Component.Toolbar', Miogen.Component.BaseComponent.extend({
        
        construct: function (cfg) {
            this._super(cfg);
        },
    
        build: function (cb) {
            var t = this;
//            
//            t.addComponent(new Miogen.Component.Button());
//            t.addComponent(new Miogen.Component.Button());
            
            // Render the base widget and newly added components
            this._super(function () {
                cb.call(this);
                this.el.addClass('toolbar');
            });
            
            
            //this.el = $('<div class="miogen-widget"><div class="pad">Collection widget</div></div>');
        }
        
    }));
    
});