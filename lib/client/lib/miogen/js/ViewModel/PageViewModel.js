Miogen.require(['ViewModel.BaseViewModel',
                'Data.MiogenStore',
                'Layout.RowContainer'], function () {
                
    Miogen.define('ViewModel.PageViewModel', Miogen.ViewModel.BaseViewModel.extend({
        
        el: null,
        
        components: null,
        
        store: null,
        
        widgets: null,
        
        deferredResizeTimeout: null,
        
        deferredResizeCallbacks: null,
        
        scrollWidth: null,
        
        construct: function (cfg) {
            this._super(cfg);
            
            this.components = [];
            this.widgets = {};
            this.store = new Miogen.Data.MiogenStore(Miogen.attr('apiUrl'));
            this.deferredResizeCallbacks = [];
        },
        
        renderTo: function (el) {
            var i, t = this;
            
            document.title = this.config.title;
            
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
                },
                error: function () {
                }
            });
        },
        
        build: function (cb) {
            var i, layout = this.config.layout, t = this, loadedComps = 0;
            
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
        
        deferredResize: function (cb) {
            var t = this, i;
            
            if (typeof(cb) !== 'undefined') {
                this.deferredResizeCallbacks.push(cb);
            }
            
            if (this.deferredResizeTimeout === null) {
                this.deferredResizeTimeout = setTimeout(function () {
                    t.deferredResizeTimeout = null;
                    t.setWidgetHeights();
                    
                    $.each(t.deferredResizeCallbacks, function (index, cb) {
                        cb();
                    })
                    t.deferredResizeCallbacks = [];
                }, 0);
            }
        },
        
        getScrollWidth: function () {
            var scrollDiv;
            
            if (this.scrollWidth === null) {
                // Create the measurement node
                scrollDiv = document.createElement("div");
                scrollDiv.className = "scrollbar-measure";
                document.body.appendChild(scrollDiv);
                
                // Get the scrollbar width
                this.scrollWidth = scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
                
                // Delete the DIV 
                document.body.removeChild(scrollDiv);
            }
            return this.scrollWidth;
        },
        
        hasScrollbar: function (el) {
            return $(el).prop('clientHeight') < $(el).prop('scrollHeight');
        },
        
        forceReflow: function () {
//            var div = $('<div></div>');
//            $(document.body).prepend(div);
//            setTimeout(function () {
//                div.remove();
//                console.log('Reflow forced');
//            },0);
        },
        
        setWidgetHeights: function () {
            // Set the height of each widget minus 10px border top and bottom
//            $('div.miogen-widget').each(function (index, item) {
//                $(item).height($(item).parent().height() - 20);
//            });
//            
//            $('div.miogen-widget div.widget-body').each(function (index, item) {
//                var padding;
//                
//                padding = $(item).outerHeight(true) - $(item).height();
//                $(item).height($(item).parent().innerHeight() - padding - $('div.widget-header', $(item).parent()).outerHeight());
//            });

            $('.auto-height').each(function (index, item) {
                var padding, freeHeight = $(item).parent().height();
                
                // Subtract all the sibling heights
                $(item).siblings().each(function (index, sibling) {
                    freeHeight -= $(sibling).outerHeight(true);
                });
                
                padding = $(item).outerHeight(true) - $(item).height();
                freeHeight -= padding;
                $(item).height(freeHeight);
                
//                var padding;
//                
//                padding = $(item).outerHeight(true) - $(item).height();
//                $(item).height($(item).parent().innerHeight() - padding - $('div.widget-header', $(item).parent()).outerHeight());
            });
        },
        
        registerWidget: function (widget) {
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