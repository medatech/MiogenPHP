Miogen.require(['Component.BaseComponent',
                'Component.DataField'], function () {
    
    Miogen.define('Component.DataForm', Miogen.Component.BaseComponent.extend({
        
        fields: null,
        
        construct: function (cfg) {
            this._super(cfg);
            this.fields = [];
        },
    
        build: function (cb) {
            this.el = $('<form class="data-form"></form>');
            cb.call(this);
        },
        
        addField: function (field) {
            this.addComponent(field);
        },
        
        renderFields: function (cb) {
            var t = this, onBuild, buildCount = 0;
            
            // Make sure we build them all first, then render to
            // make sure they get rendered in the correct order
            onBuild = function () {
                buildCount += 1;
                if (t.components.length === buildCount) {
                    // Last one built, now render them
                    $.each(t.components, function (index, comp) {
                        comp.renderTo(t.el);
                    });
                }
            }
            
            
            // Build all the components
            $.each(this.components, function (index, comp) {
                comp.build(onBuild);
                Miogen.bind(t, comp, 'onChange', function (value) {
                    t.onFieldChange(comp, value);
                });
            });
        },
        
        removeFields: function () {
            this.removeAllComponents();
        },
        
        onFieldChange: function (field, value) {
            
        }
        
//        addItem: function (/* MiogenItem */ item) {
//            var tr, t = this;
//            
//            tr = $('<tr></tr>');
//            tr.attr('data-id', item.getUri());
//            
//            // Add all the column items
//            $(this.columns).each(function (index, col) {
//               var td = $('<td></td>'), label;
//               
//               label = item.get(col.id + '.prompt');
//               if (label === null) {
//                   label = item.get(col.id + '.value');
//               }
//               td.text(label);
//               tr.append(td);
//            });
//            
//            tr.click(function () {
//                // Select the item
//                t.onItemSelect(item.getUri());
//            });
//            
//            $('tbody', this.el).append(tr);
//        },
//        
//        updateItem: function (/* MiogenItem*/ item, attribute, value) {
//            console.log ('Grid view updating item', arguments);
//        },
//        
//        selectItem: function (value) {
//            $('tbody > tr', this.el).removeClass('selected');
//            $('tbody > tr[data-id=\'' + value + '\']', this.el).addClass('selected');
//        },
//        
//        onItemSelect: function (value) {}
    }));
    
});