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
            
            this.addComponent(this.toolbar);
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
                        var fields;
                        //var el = $('<table></table>');
                        t.setTitle(col.getPrompt());
                        
                        fields = col.getTemplate().getDataFields();
                        
                        $(fields).each(function (index, field) {
                            t.gridView.addColumn(field.getID(), field.get('prompt'));
                        });
                        
                        $(col.getItems()).each(function (index, item) {
                            t.gridView.addItem(item);
                            //var tr = $('<tr><td></td><td></td></tr>');
                            
                            //$('td:nth(0)', tr).text(item.get('id.value'));
                            //$('td:nth(1)', tr).text(item.get('name.value'));
                            
                            //el.append(tr);
                        });
                        
                        //t.containerEl.append(el);
                    }
                });
                // Monitor for when it changes
                
            }
        },
        
        itemAdded: function (/* MiogenItem */ item) {
            
        },
        
        itemRemoved: function (/* MiogenItem */ item) {
            
        },
        
        itemModified: function (/* MiogenItem */ item, /* array */ fields) {
            
        },
        
        modelModified: function (/* string */ attribute, /* mixed */ value) {
            
        }
        
    }));
    
});