Miogen.require(['Widget.BaseWidget',
                'Component.Toolbar',
                'Component.GridView'], function () {
    
    Miogen.define('Widget.CollectionWidget', Miogen.Widget.BaseWidget.extend({
        
        toolbar: null,
        gridView: null,
        
        construct: function (cfg) {
            this._super(cfg);
            
            this.toolbar = new Miogen.Component.Toolbar();
            this.gridView = new Miogen.Component.GridView();
            
            //this.addComponent(this.toolbar);
            this.addComponent(this.gridView);
        },
        
        build: function (cb) {
            var t = this;
            // Render the base widget
            this._super(function () {
                // Register this widget with the view model
                Miogen.getViewModel().registerWidget(t);
                cb.call(t);
            });
        },
        
        onCollectionLoad: function (collection) {
            
        },
        
        initData: function () {
            var t = this;
            
            if (this.config.hasOwnProperty('bind')) {
                Miogen.getViewModel().get({
                    url: this.config.bind.uri,
                    success: function (col) {
                        var fields, weights, totalWeight, paginationQuery, startField, limitField, rangeQS;
                        t.setTitle(col.getPrompt());
                        
                        fields = col.getTemplate().getDataFields();
                        
                        // Work out the proportional widths of each column
                        weights = [];
                        totalWeight = 0;
                        $(fields).each(function (index, field) {
                            var type, weight;
                            
                            // Keep it simple, if it's a text/URI field, it'll be weighted 4,
                            // otherwise weighted 1
                            type = field.getType();
                            if (type === 'text' || type === 'uri') {
                                weight = 4;
                            }
                            else {
                                weight = 1;
                            }
                            
                            weights.push(weight);
                            totalWeight += weight;
                        });
                        
                        $(fields).each(function (index, field) {
                            var width = Math.round((weights[index] / totalWeight) * 100);
                            t.gridView.addColumn(field.getID(), field.get('prompt'), width, field);
                        });
                        
                        // See if this is a paginated document
                        paginationQuery = col.getQueryByRel('items');
                        if (paginationQuery !== null) {
                            // We need to enter pagination mode and query the first page
                            startField = paginationQuery.getDataFieldByRel('start');
                            limitField = paginationQuery.getDataFieldByRel('limit');
                            
                            rangeQS = '?' + startField.getID() + '=' + 0 + '&' + limitField.getID() + '=' + Math.min(limitField.getMax(100), 100);
                            
                            Miogen.getViewModel().get({
                                url: t.config.bind.uri + rangeQS,
                                success: function (col) {
                                    // We have all the items directly, so just populate them
                                    $(col.getItems()).each(function (index, item) {
                                        t.gridView.addItem(item);
                                    });
                                },
                                error: function () {}
                            });
                        }
                        else {
                            // We have all the items directly, so just populate them
                            $(col.getItems()).each(function (index, item) {
                                t.gridView.addItem(item);
                            });
                        }
                    }
                });
                
                // Bind to the itemSelected
                if (this.config.bind.hasOwnProperty('selectedItem')) {
                    Miogen.bind(this, Miogen.getViewModel(), 'set', function (key, value) {
                        if (key === t.config.bind.selectedItem) {
                            t.gridView.selectItem(value);
                        }
                    });
                    
                    Miogen.bind(this, this.gridView, 'onItemSelect', function (value) {
                        Miogen.getViewModel().set(t.config.bind.selectedItem, value);
                    });
                }
            }
        },
        
        destroy: function () {
            Miogen.unbind(this, Miogen.getViewModel(), 'set');
            Miogen.unbind(this, this.gridView, 'onItemSelect');
            this._super();
        }
        
    }));
    
});