Miogen.require(['Component.BaseComponent'], function () {
    
    Miogen.define('Layout.ColumnContainer', Miogen.Component.BaseComponent.extend({
        
        construct: function (cfg) {
            this._super(cfg);
        },
        
        build: function (cb) {
            var comp, t = this;
            
            this.el = $('<div class="col" style="height: 100%;"></div>');
            
            if (this.config.hasOwnProperty('width')) {
                this.el.css('width', this.config.width);
            }
            
            if (this.config.hasOwnProperty('widget')) {
                Miogen.requireModule(this.config.widget['class'], function (WidgetClass) {
                    var comp = new WidgetClass(t.config.widget);
                    // Todo: register the component with the view model
                    
                    comp.build(function () {
                        t.components.push(comp);
                        cb.call(t);
                    });
                });
            }
            else {
                cb.call(this);
            }
        }
        
    }))
    
});