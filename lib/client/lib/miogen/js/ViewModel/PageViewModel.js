Miogen.require(['ViewModel.BaseViewModel',
                'Data.MiogenStore',
                'Layout.RowContainer'], function () {
                
    Miogen.define('ViewModel.PageViewModel', Miogen.ViewModel.BaseViewModel.extend({
        
        el: null,
        
        components: null,
        
        store: null,
        
        widgets: null,
        
        construct: function (cfg) {
            this._super(cfg);
            
            this.components = [];
            this.widgets = {};
            this.store = new Miogen.Data.MiogenStore(Miogen.config('apiUrl'));
        },
        
        renderTo: function (el) {
            var i, t = this;
            
            document.title = this.cfg.title;
            
            for (i = 0; i < this.components.length; i += 1) {
                this.components[i].renderTo(this.el);
            }
            
            el.append(this.el);
            
            // Set the widget heights and bind to the window resize
            this.setWidgetHeights();
            $(window).resize(function () {
                t.setWidgetHeights();
            });
            
            this.store.get({
                url: '/API/1/',
                success: function (items) {
                    console.log(items);
                },
                error: function () {
                    console.log(arguments);
                }
            });
        },
        
        build: function (cb) {
            var i, layout = this.cfg.layout, t = this, loadedComps = 0;
            
            this.el = $('<div class="miogen-page"></div>');
            
            if (layout.hasOwnProperty('rows') && layout.rows.length > 0) {
                $.each(layout.rows, function (index, row) {
                    var comp = new Miogen.Layout.RowContainer(row);
                    comp.build(function () {
                        loadedComps += 1;
                        t.components.push(comp);
                        if (loadedComps === layout.rows.length) {
                            cb.call(t);
                        }
                    });
                });
            }
            else {
                cb.call(this);
            }
        },
        
        setWidgetHeights: function () {
            // Set the height of each widget minus 10px border top and bottom
            $('div.miogen-widget').each(function (index, item) {
                $(item).height($(item).parent().height() - 20);
            });
            
            $('div.miogen-widget div.widget-body').each(function (index, item) {
                var padding;
                
                padding = $(item).outerHeight(true) - $(item).height();
                $(item).height($(item).parent().innerHeight() - padding - $('div.widget-header', $(item).parent()).outerHeight());
            });
        },
        
        registerWidget: function (widget) {
            console.log('Widget registerd', widget);
            this.widgets[widget.getConfig('name')] = widget;
            widget.setViewModel(this);
        },
        
        initData: function () {
            var widgetName;
            
            for (widgetName in this.widgets) {
                if (this.widgets.hasOwnProperty(widgetName)) {
                    this.widgets[widgetName].initData();
                }
            }
        },
        
        bindData: function (who, uri) {
            //Miogen.bind(
        },
        
        get: function (cfg) {
            this.store.get(cfg);
        },
        
        /**
         * doc: MiogenDocument
         * success: function () {}
         * error: function (message) {}
         */
        put: function (cfg) {
            this.store.put(cfg);
        }
    }));
});