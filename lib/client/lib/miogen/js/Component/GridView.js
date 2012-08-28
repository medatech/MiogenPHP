Miogen.require(['Component.BaseComponent',
                'Component.Button'], function () {
    
    Miogen.define('Component.GridView', Miogen.Component.BaseComponent.extend({
        
        columns: null,
        
        construct: function (cfg) {
            this._super(cfg);
            this.columns = [];
        },
    
        build: function (cb) {
            var t = this;
            
            this.el = $('<table class="grid-view"><thead><tr></tr></thead><tbody></tbody></table>');
            
            cb.call(this);
        },
        
        addColumn: function (id, label, width) {
            var th;
                
            //field = $('tr:first th', this.el).length - 1;
            
            // Add the title column
            th = $('<th></th>');
            th.text(label);
            $('thead > tr', this.el).append(th);
            
            // Add the data columns
            $('tbody > tr').append('<td>&nbsp;</td>');
            
            this.columns.push({
                id: id,
                th: th
            });
        },
        
        addItem: function (/* MiogenItem */ item) {
            var tr;
            
            tr = $('<tr></tr>');
            
            // Add all the column items
            $(this.columns).each(function (index, col) {
               var td = $('<td></td>'), label;
               
               label = item.get(col.id + '.prompt');
               if (label === null) {
                   label = item.get(col.id + '.value');
               }
               td.text(label);
               tr.append(td);
            });
            
            $('tbody', this.el).append(tr);
        },
        
        updateItem: function (/* MiogenItem*/ item, attribute, value) {
            console.log ('Grid view updating item', arguments);
        }
    }));
    
});