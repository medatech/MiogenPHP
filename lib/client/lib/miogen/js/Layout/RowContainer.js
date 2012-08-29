Miogen.require(['Component.BaseComponent', 'Layout.ColumnContainer'], function () {
    
    Miogen.define('Layout.RowContainer', Miogen.Component.BaseComponent.extend({
        
        construct: function (cfg) {
            this._super(cfg);
        },
        
        build: function (cb) {
            var i, t = this, loadedComps = 0;
            
            this.el = $('<div class="row"></div>');
            
            if (this.config.hasOwnProperty('height')) {
                this.el.css('height', this.config.height);
            }
            
            if (this.config.hasOwnProperty('cols') && t.config.cols.length > 0) {
                $.each(this.config.cols, function (index, col) {
                    var comp;
                    
                    comp = new Miogen.Layout.ColumnContainer(col);
                    comp.build(function () {
                        console.log('Loaded row child ' + index);
                        loadedComps += 1;
                        t.components[index] = comp; // Set by index so there isn't a race condition
                        
                        if (loadedComps === t.config.cols.length) {
                            cb.call(t);
                        }
                    });
                });
            }
            else {
                cb.call(t);
            }
            
        }
        
    }))
    
});