
Miogen.define('Component.BaseComponent', Class.extend({
    
    el: null,
    
    components: null,
    
    containerEl: null,
    
    config: null,
    
    construct: function (cfg) {
        this.components = [];
        if (typeof (cfg) === 'undefined') {
            cfg = {};
        }
        this.config = cfg;
    },
    
    getConfig: function (name) {
        return this.config[name];
    },
    
    build: function (cb) {
        var i, compCount = 0, t = this;
        
        if (this.el === null) {
            this.el = $('<div></div>');
            
            if (this.components.length > 0) {
                $.each(this.components, function (index, comp) {
                    comp.build(function () {
                        compCount += 1;
                        if (compCount === t.components.length) {
                            cb.call(t);
                        }
                    });
                });
            }
            else {
                // No child components to build
                cb.call(this);
            }
        }
        else {
            // It's being built more than once, so just skip the additional calls'
            cb.call(this);
        }
    },
    
    getEl: function () {
        if (this.el === null) {
            throw "Widget not built";
        }
        return this.el;
    },
    
    addComponent: function (component) {
        this.components.push(component);
    },
        
    renderTo: function (el) {
        var thisEl, i, container;

        thisEl = this.getEl();

        if (this.containerEl === null) {
            container = thisEl;
        }
        else {
            container = this.containerEl;
        }

        // Add all the child components
        for (i = 0; i < this.components.length; i += 1) {
            this.components[i].renderTo(container);
        }

        // Add this component
        el.append(thisEl);
    }
}));