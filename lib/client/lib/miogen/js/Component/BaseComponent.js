
Miogen.define('Component.BaseComponent', Class.extend({
    
    el: null,
    
    components: null,
    
    containerEl: null,
    
    /**
     * @cfg viewModel The data store to get/set bind properties
     */
    config: null,
    
    viewModel: null,
    
    construct: function (cfg) {
        this.components = [];
        if (typeof (cfg) === 'undefined') {
            cfg = {};
        }
        this.config = cfg;
    },
    
    setViewModel: function (viewModel) {
        this.viewModel = viewModel;
        
        // Set the view model on all the child components
        $.each(this.components, function (index, comp) {
            comp.setViewModel(viewModel);
        });
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
        return this.el;
    },
    
    addComponent: function (component) {
        var el;
        
        this.components.push(component);
        
        // Render the element if we are already rendered
        if (this.containerEl !== null) {
            el = this.containerEl;
        }
        else {
            el = this.el;
        }
        
        if (el !== null && component.getEl() !== null) {
            component.renderTo(el);
        }
    },
    
    removeAllComponents: function () {
        $.each(this.components, function (index, comp) {
            comp.destroy();
        });
        this.components = [];
    },
    
    destroy: function () {
        this.removeAllComponents();
        this.el.remove();
        
        // TODO: Unbind any data bindings
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
    },
    
    disable: function () {
        $(this.el).attr('disabled', true);
    },
    
    enable: function () {
        $(this.el).removeAttr('disabled');
    },
    
    onChange: function (value) {}
    
}));