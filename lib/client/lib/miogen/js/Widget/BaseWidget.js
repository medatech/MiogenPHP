Miogen.require(['Component.BaseComponent'], function () {
    
    Miogen.define('Widget.BaseWidget', Miogen.Component.BaseComponent.extend({
        
        construct: function (cfg) {
            this._super(cfg);
            this.components = [];
        },
        
        build: function (cb) {
            this._super(function () {
                this.el = $(
                    '<div class="miogen-widget auto-height">' +
                        '<div class="widget-header"><h1>&nbsp;</h1></div>' +
                        '<div class="widget-body auto-height"></div>' +
                    '</div>');
                
                if (this.config.hasOwnProperty('title')) {
                    $('h1', this.el).text(this.config.title);
                }
                
                this.containerEl = $('div.widget-body', this.el);
                cb.call(this);
            });
        },
        
        initData: function () {
            
        },
        
        setTitle: function (title) {
            $('h1', this.el).text(title);
        }

    }));

});