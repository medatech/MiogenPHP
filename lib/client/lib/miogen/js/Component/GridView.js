Miogen.require(['Component.BaseComponent',
                'Component.Button'], function () {
    
    Miogen.define('Component.GridView', Miogen.Component.BaseComponent.extend({
        
        columns: null,
        items: [],
        
        construct: function (cfg) {
            this._super(cfg);
            this.columns = [];
        },
    
        build: function (cb) {
            var t = this;
            
            this.el = $('<table class="grid-view"><thead><tr></tr></thead><tbody></tbody></table>');
            
            cb.call(this);
        },
        
        addColumn: function (id, label, width, fieldTemplate) {
            var th;
                
            //field = $('tr:first th', this.el).length - 1;
            
            // Add the title column
            th = $('<th></th>');
            if (width !== null) {
                th.css('width', width + '%');
            }
            th.text(label);
            $('thead > tr', this.el).append(th);
            
            // Add the data columns
            $('tbody > tr', this.el).append('<td>&nbsp;</td>');
            
            this.columns.push({
                id: id,
                th: th,
                template: fieldTemplate
            });
        },
        
        addItem: function (/* MiogenItem */ item) {
            var tr, t = this, localItem;
            
            tr = $('<tr></tr>');
            
            localItem = {
                item: item,
                tr: tr,
                remoteBindings: {}
            };
            
            this.items.push(localItem);
            
            tr.attr('data-id', item.getUri());
            
            // Add all the column items
            $(this.columns).each(function (index, col) {
               var td = $('<td></td>'), label;
               
               label = item.get(col.id + '.valuePrompt');
               if (label === null) {
                   label = item.get(col.id + '.value');
               }
               td.text(label);
               tr.append(td);
            });
            
            tr.click(function () {
                // Select the item
                t.onItemSelect(item.getUri());
            });
            
            $('tbody', this.el).append(tr);
            
            // Monitor for when this item changes
            Miogen.bind(t, item, 'onValueChange', function (attribute, value) {
                var i, type, template, displayValue = value, setValueFunc, col;
                
                // Find the column that matches this item
                for (i = 0; i < t.columns.length; i += 1) {
                    col = t.columns[i];
                    if (col.id + '.value' === attribute) {
                        
                        template = col.template;
                        
                        type = template.getType();
                        
                        setValueFunc = function (displayValue) {
                            $('td:nth(' + i + ')', localItem.tr).text(displayValue);
                        };
                        
                        switch (type) {
                            case 'uri': {
                                // See if we were monitoring another field, and if so, unbind it
                                if (localItem.remoteBindings.hasOwnProperty(col.id)) {
                                    // There is a previously bound item here
                                    Miogen.unbind(t, localItem.remoteBindings[col.id], 'onValueChange');
                                    delete localItem.remoteBindings[col.id];
                                }
                                
                                // Get the item from the store
                                Miogen.getViewModel().get({
                                    url: value,
                                    success: function (doc) {
                                        var remoteItem = doc.getItem(0);
                                        // Store this item in the local item list so we can unbind it later
                                        localItem.remoteBindings[col.id] = remoteItem;
                                        
                                        // Monitor changes to the remote item
                                        Miogen.bind(t, remoteItem, 'onValueChange', function (attribute, value) {
                                            if (attribute === template.getPromptField() + '.value') {
                                                setValueFunc(value);
                                            }
                                        });
                                        
                                        setValueFunc(remoteItem.get(template.getPromptField() + '.value'));
                                    },
                                    error: function () {
                                        setValueFunc('Error loading data');
                                    }
                                });
                                break;
                            }
                            default: {
                                setValueFunc(displayValue);
                            }
                        }
                        
                        break;
                    }
                }
                console.log('Item field updated, need to see if it exists in grid');
            });
            
            // Watch for when the item becomes dirty
            Miogen.bind(t, item, 'setDirtyFlag', function (isDirty) {
                if (isDirty) {
                    localItem.tr.addClass('dirty');
                }
                else {
                    localItem.tr.removeClass('dirty');
                }
            });
        },
        
        selectItem: function (value) {
            $('tbody > tr', this.el).removeClass('selected');
            $('tbody > tr[data-id=\'' + value + '\']', this.el).addClass('selected');
        },
        
        onItemSelect: function (value) {},
        
        destroy: function () {
            var t = this;
            
            // Unbind to all the items
            $.each(this.items, function (index, item) {
                Miogen.unbind(t, item, 'onValueChange');
                Miogen.unbind(t, item, 'setDirtyFlag');
            });
            
            this._super();
        }
    }));
    
});