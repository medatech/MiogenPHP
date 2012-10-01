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
    }));
    
});