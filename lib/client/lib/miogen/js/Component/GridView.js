Miogen.require(['Component.BaseComponent',
                'Component.Button'], function () {
    
    Miogen.define('Component.GridView', Miogen.Component.BaseComponent.extend({
        
        columns: null,
        items: [],
        cbResizePending: false,
        
        construct: function (cfg) {
            this._super(cfg);
            this.columns = [];
        },
    
        build: function (cb) {
            var t = this;
            
            this.el = $('<div class="grid-view"><div class="header"><table class="grid-view"><thead><tr></tr></thead></table></div><div class="scroll auto-height"><table class="grid-view body"><tbody></tbody></table></div></div>');
            
            // Watch for the window to resize to update the scroll bar
            Miogen.bind(this, Miogen.getViewModel(), 'setWidgetHeights', function () {
                t.fixScrollWidth();
            });
            
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
                template: fieldTemplate,
                width: width
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
               
               if (col.width) {
                   td.css('width', col.width + '%');
               }
               
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
            
            if (this.cbResizePending === false) {
                // Not yet waiting for a resize callback, so set one up
                this.cbResizePending = true;
                
                // Resize the widget height accordingly
                Miogen.getViewModel().deferredResize(function () {
                    t.cbResizePending = false;
                    t.fixScrollWidth();
                });
            }
        },
        
        fixScrollWidth: function () {
            var t = this;
            if (Miogen.getViewModel().hasScrollbar($('div.scroll', t.el))) {
                $('div.header', t.el).css('padding-right', Miogen.getViewModel().getScrollWidth() + 'px');
            }
            else {
                $('div.header', t.el).css('padding-right', '0px');
            }
            
            // Relow the content to force it to show the correct header width
            $('div.header table', t.el).css('width', '99.999%');
            setTimeout(function () {
                $('div.header table', t.el).css('width', '100%');
            },0);
        },
        
        selectItem: function (value) {
            $('tbody > tr', this.el).removeClass('selected');
            $('tbody > tr[data-id=\'' + value + '\']', this.el).addClass('selected');
        },
        
        onItemSelect: function (value) {},
        
        destroy: function () {
            var t = this;
            
            Miogen.unbind(this, Miogen.getViewModel(), 'setWidgetHeights');
            
            // Unbind to all the items
            $.each(this.items, function (index, item) {
                Miogen.unbind(t, item, 'onValueChange');
                Miogen.unbind(t, item, 'setDirtyFlag');
            });
            
            this._super();
        }
    }));
    
});