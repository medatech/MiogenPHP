Miogen.require(['Widget.BaseWidget',
                'Component.Toolbar',
                'Component.Button',
                'Component.DataForm',
                'Component.DataField'], function () {
    
    Miogen.define('Widget.ItemWidget', Miogen.Widget.BaseWidget.extend({
        
        toolbar: null,
        dataForm: null,
        
        construct: function (cfg) {
            var t = this;
            
            this._super(cfg);
            
            this.toolbar = new Miogen.Component.Toolbar();
            this.dataForm = new Miogen.Component.DataForm();
            
            this.toolbar.addComponent(new Miogen.Component.Button({
                label: 'Save',
                disabled: true
            }));
            this.toolbar.addComponent(new Miogen.Component.Button({
                label: 'Refresh',
                disabled: true
            }));
            
            Miogen.bind(this.dataForm, 'onFieldChange', function (field, value) {
                t.onFieldChange(field, value);
            });
            
            this.addComponent(this.toolbar);
            this.addComponent(this.dataForm);
            
        },
        
        onFieldChange: function (field, value) {
            this.toolbar.enable();
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
                if (this.config.bind.hasOwnProperty('selectedItems')) {
                    // Bind to watch what items are selected
                    Miogen.getViewModel().bind(this, this.config.bind.selectedItems, function (key, value) {
                        if ($.inArray(key, t.config.bind.selectedItems) !== -1) {
                            t.onItemLoad(value);
                        }
                    });
                }
            }
        },
        
        onItemLoad: function (uri) {
            var t = this;
            console.log('Getting ' + uri);
            
            this.toolbar.disable();
            
            Miogen.getViewModel().get({
                url: uri,
                success: function (doc) {
                    var fields;
                    //var el = $('<table></table>');
                    t.setTitle(doc.getPrompt());

                    t.displayItem(doc, function () {});

                    

//                    fields = col.getTemplate().getDataFields();
//
//                    $(fields).each(function (index, field) {
//                        t.gridView.addColumn(field.getID(), field.get('prompt'));
//                    });
//
//                    $(col.getItems()).each(function (index, item) {
//                        t.gridView.addItem(item);
//                        //var tr = $('<tr><td></td><td></td></tr>');
//
//                        //$('td:nth(0)', tr).text(item.get('id.value'));
//                        //$('td:nth(1)', tr).text(item.get('name.value'));
//
//                        //el.append(tr);
//                    });

                    //t.containerEl.append(el);
                },
                error: function () {
                    console.log('Error', arguments);
                }
            });
        },
        
        displayItem: function (doc, cb) {
            var t = this, fields, item;
            
            this.dataForm.removeFields();
            
            item = doc.getItem(0); // Get the first item, which is the one to display
            if (item !== null) {
                fields = doc.getTemplate().getDataFields();
                $(fields).each(function (index, fieldTemplate) {
                    var field, dataField = null;
                    
                    dataField = item.getField(fieldTemplate.getID());
                    
                    field = new Miogen.Component.DataField({
                        id: fieldTemplate.getID(),
                        template: fieldTemplate,
                        data: dataField
                    });
                    t.dataForm.addField(field);
                });
                
                t.dataForm.renderFields();
            }
        }
        
        
    }));
    
});