Miogen.require(['Component.BaseComponent'], function () {
    
    Miogen.define('Widget.BaseWidget', Miogen.Component.BaseComponent.extend({
        
        construct: function (cfg) {
            this._super(cfg);
            this.components = [];
        },
        
        getRandomColor: function () {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.round(Math.random() * 15)];
            }
            return color;
        },
        
        build: function (cb) {
            this._super(function () {
                this.el = $(
                    '<div class="miogen-widget">' +
                        '<div class="widget-header"><h1>&nbsp;</h1></div>' +
                        '<div class="widget-body" style="background-colorp: ' + this.getRandomColor() + '"></div>' +
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