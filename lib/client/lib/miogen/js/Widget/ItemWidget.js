/*globals Miogen,$ */

/**
 * A widget that controls the management of a single Migoen Item.
 * 
 * @class Miogen.Widget.ItemWidget
 * @extends Miogen.Widget.BaseWidget
 * @constructor
 */
Miogen.require(['Widget.BaseWidget',
                'Component.Toolbar',
                'Component.Button',
                'Component.DataForm',
                'Component.DataField',
                'Component.Label'], function () {
    
    Miogen.define('Widget.ItemWidget', Miogen.Widget.BaseWidget.extend({
        
        toolbarItems: null,
        toolbar: null,
        dataForm: null,
        doc: null,
        
        /**
         * The miogen item that is currently being displayed within the widget.
         * @property item
         * @type Miogen.Data.MiogenItem
         * @defaultValue null
         */
        item: null,
        
        construct: function (cfg) {
            var t = this;
            
            this._super(cfg);
            
            this.toolbarItems = {
                save: new Miogen.Component.Button({
                    label: 'Save',
                    disabled: true,
                    click: function () {
                        t.saveItem();
                    }
                }),
                refresh: new Miogen.Component.Button({
                    label: 'Revert',
                    disabled: true,
                    click: function () {
                        t.item.rollback();
                    }
                }),
                saveLabel: new Miogen.Component.Label({
                    text: 'Saved successfully',
                    className: 'green-label',
                    visible: false
                })
            };
            
            this.toolbar = new Miogen.Component.Toolbar();
            this.dataForm = new Miogen.Component.DataForm();
            
            this.toolbar.addComponent(this.toolbarItems.save);
            this.toolbar.addComponent(this.toolbarItems.refresh);
            this.toolbar.addComponent(this.toolbarItems.saveLabel);
            
            Miogen.bind(t, this.dataForm, 'onFieldChange', function (field, value) {
                t.onFieldChange(field, value);
            });
            
            this.addComponent(this.toolbar);
            this.addComponent(this.dataForm);
            
        },
        
        onFieldChange: function (field, value) {
            this.toolbar.attr('disabled', false);
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
                    Miogen.bind(this, Miogen.getViewModel(), 'set', function (key, value) {
                        if ($.inArray(key, t.config.bind.selectedItems) !== -1) {
                            t.onItemLoad(value);
                        }
                    });
                }
            }
        },
        
        onItemLoad: function (uri) {
            var t = this;
            
            this.toolbar.attr('disabled', true);
            
            Miogen.getViewModel().get({
                url: uri,
                success: function (doc) {
                    var fields;
                    //var el = $('<table></table>');
                    
                    t.displayItem(doc, function () {});
                },
                error: function () {
                    //console.log('Error', arguments);
                }
            });
        },
        
        displayItem: function (doc, cb) {
            var t = this, fields, item;
            
            this.dataForm.removeFields();
            
            // Unbind to the previous item first
            if (this.item !== null) {
                Miogen.unbind(this, this.item, 'setDirtyFlag');
            }
            
            this.doc = doc;
            this.item = doc.getItem(0); // Get the first item, which is the one to display
            if (this.item !== null) {
                // Set the widget title
                t.setTitle(doc.getPrompt() + ' ' + this.item.get('name.value'));
                
                // Bind to the new item
                Miogen.bind(this, this.item, 'setDirtyFlag', function (isDirty) {
                    t.setItemDirty(isDirty);
                });
                
                // Watch for the name cahnge to set the title
                Miogen.bind(this, this.item, 'onValueChange', function (attribute, value) {
                    if (attribute === 'name.value') {
                        t.setTitle(doc.getPrompt() + ' ' + value);
                    }
                });
                
                // Set whether this is dirty to start with
                this.setItemDirty(this.item.isDirty());
                
                fields = doc.getTemplate().getDataFields();
                $(fields).each(function (index, fieldTemplate) {
                    var field, dataField = null;
                    
                    dataField = t.item.getField(fieldTemplate.getID());
                    
                    field = new Miogen.Component.DataField({
                        id: fieldTemplate.getID(),
                        template: fieldTemplate,
                        data: dataField
                    });
                    t.dataForm.addField(field);
                });
                
                t.dataForm.renderFields();
            }
        },
        
        setItemDirty: function (isDirty) {
            if (isDirty) {
                this.toolbarItems.save.attr('disabled', false);
                this.toolbarItems.refresh.attr('disabled', false);
            }
            else {
                this.toolbarItems.save.attr('disabled', true);
                this.toolbarItems.refresh.attr('disabled', true);
            }
        },
        
        destroy: function () {
            if (this.item !== null) {
                Miogen.unbind(this, this.item, 'setDirtyFlag');
                Miogen.bind(this, this.item, 'onValueChange');
            }
            
            Miogen.unbind(this, Miogen.getViewModel(), 'set');
            Miogen.unbind(this, this.dataForm, 'onFieldChange');
            this._super();
        },
        
        saveItem: function () {
            var t = this;
            
            if (this.doc !== null) {
                this.toolbarItems.save.attr('label', 'Saving...');
                this.toolbarItems.save.attr('disabled', true);
                this.toolbarItems.refresh.attr('disabled', true);
                
                Miogen.getViewModel().put({
                    doc: this.doc,
                    success: function () {
                        t.toolbarItems.save.attr('label', 'Save');
                        
                        t.toolbarItems.saveLabel.attr('visible', true);
                        setTimeout(function () {
                            t.toolbarItems.saveLabel.attr('visible', false);
                        }, 3000);
                    },
                    error: function () {
                        //console.log('Save error');
                        t.toolbarItems.save.attr('label', 'Save');
                        t.toolbarItems.save.attr('disabled', false);
                        t.toolbarItems.refresh.attr('disabled', false);
                    }
                });
            }
        }
    }));
    
});