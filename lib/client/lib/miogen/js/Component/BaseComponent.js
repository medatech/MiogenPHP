/**
 * The base of all components providing support for child component, a render element
 * and display controls for the component which can be overriden by sub classes.
 * 
 * @class Miogen.Component.BaseComponent
 * @constructor
 */
Miogen.define('Component.BaseComponent', Class.extend({
    
    /**
     * The jQuery DOM object that represents this component.
     * @property el
     * @type {jQuery object}
     * @default null
     */
    el: null,
    
    /**
     * Array of child components that are to be built and renders as part of this component.
     * @property components
     * @type {Miogen.Component.BaseComponent[]}
     * @default []
     */
    components: null,
    
    /**
     * The element that contains the child components.  This may be teh same as the el object.
     * @property containerEl
     * @type {jQuery object}
     * @default null
     */
    containerEl: null,
    
    /**
     * The configuration object for the component attributes.
     * @property config
     * @type {Object}
     * @default null
    */
    config: Object,
    
    /**
     * The view model that this component is attached to.
     * @property viewModel
     * @type {Miogen.ViewModel.BaseViewModel}
     * @default null
     */
    viewModel: null,
    
    /**
     * Construct a new component.
     * 
     * @method construct
     * @constructor
     * @param {Object} [cfg] The configuration object for this component.
     *     @param {Boolean} [cfg.disabled] Defaults to false.  When true, the control will be disabled.
     *     @param {Boolean} [cfg.visible] Defaults to true.  Specify whether the component is visible or hidden.
     * 
     */
    construct: function (cfg) {
        this.components = [];
        
        this.config = {
            disabled: false,
            visible: true
        };
        
        Miogen.mixIn(this.config, cfg);
    },
    
    /**
     * Sets the view model for this component.
     * 
     * @method setViewModel
     * @param {Miogen.ViewModel.BaseViewModel} viewModel The view model that this component is to be associated with.
     */
    setViewModel: function (viewModel) {
        this.viewModel = viewModel;
        
        // Set the view model on all the child components
        $.each(this.components, function (index, comp) {
            comp.setViewModel(viewModel);
        });
    },
    
    /**
     * Gets a configuration attribute for this component.
     * 
     * @method getConfig
     * @param {String} name The config key name that the value is to be retrieved for.
     * @return {mixed} The config value
     */
    getConfig: function (name) {
        return this.config[name];
    },
    
    /**
     * Builds the component HTML element with the specific properties in the constructor.
     *
     * @method build
     * @param {Function} [cb] Callback to call when the component has been built.
     * 
     * @example
     *     var button = new Miogen.Component.Button({
     *         label: 'Press Me',
     *         click: function () {
     *             alert('Thanks');
     *         }
     *     });
     *     
     *     button.build(function () {
     *         alert('Button has been built');
     *     });
     **/
    build: function (cb) {
        var i, compCount = 0, t = this;
        
        if (typeof (cb) === 'undefined') {
            cb = function () {};
        }
        else if (typeof(cb) !== 'function') {
            throw "Parameter 1 expected to be a function";
        }
        
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
    
    /**
     * Gets the component jQuery object.
     * 
     * @method getEl
     * @return {jQuery object}
     */
    getEl: function () {
        return this.el;
    },
    
    /**
     * Adds a child component to this component.
     * 
     * @method addComponent
     * @param {Miogen.Component.BaseComponent} component The component to add.
     */
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
    
    /**
     * Removes all children components and calls destroy on them.
     * @method removeAllComponents
     */
    removeAllComponents: function () {
        $.each(this.components, function (index, comp) {
            comp.destroy();
        });
        this.components = [];
    },
    
    /**
     * Destroys the component and removes it form the DOM.  This will ripple down to children components.
     * @method destoy
     */
    destroy: function () {
        this.removeAllComponents();
        this.el.remove();
        
        // TODO: Unbind any data bindings
    },
    
    /**
     * Renders the component as a child element to the supplied parent element.  All children components will in turn be rendered.
     * @method renderTo
     * @param {jQuery object} el The parent element to render to.
     */
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
        
        Miogen.getViewModel().deferredResize();
    },
    
    /**
     * Sets or gets a component attribute.
     * 
     * @method attr
     * @param {String} key The attribute to set or get.
     * @param {mixed} [value] If supplied, the attribute will be set to this value.
     * @return {mixed} The attribute after any modifications.
     */
    attr: function (key, value) {
        var propogate = false;
        
        if (typeof(value) !== 'undefined') {
            this.config[key] = value;
            
            if (this.el !== null) {
                switch (key) {
                    case 'disabled':
                        if (value === true) {
                            this.el.attr('disabled', true);
                        }
                        else {
                            this.el.removeAttr('disabled');
                        }
                        propogate = true;
                        break;
                    case 'visible':
                        if (value === true) {
                            this.el.removeClass('hidden');
                        }
                        else {
                            this.el.addClass('hidden');
                        }
                        break;
                }
            }
        }
        else {
            value = this.config[key] || null;
        }
        
        if (propogate) {
            $.each(this.components, function (index, comp) {
                comp.attr(key, value);
            });
        }
        
        return value;
    },
    
    /**
     * Fired when the value of the component has changed.
     * @event onChange
     * @param {mixed} value The value of the component after the change.
     */
    onChange: function (value) {}
    
}));