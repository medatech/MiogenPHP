/*globals Miogen,$ */

/**
 * A Button UI component that can receive press events from the user.
 * 
 * @class Miogen.Component.Button
 * @extends Miogen.Component.BaseComponent
 * @constructor
 */
Miogen.require(['Component.BaseComponent'], function () {
    
    Miogen.define('Component.Button', Miogen.Component.BaseComponent.extend({
        
        /**
         * Construct a new button component.
         * 
         * @method construct
         * @param {Object} [cfg] The configuration object for this button. See Miogen.Component.BaseComponent construct for additional options.
         *     @param {String} [cfg.label] The button label.
         *     @param {Function} [cfg.click] The click event to call when the button is clicked.
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
         */
        construct: function (cfg) {
            var config = {
                label: 'Button',
                disabled: false
            };
            
            Miogen.mixIn(config, cfg);
            
            this._super(config);
        },
        
        /**
         * Builds the &lt;button&gt; HTML element with the specified properties in the constructor.
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
         */
        build: function (cb) {
            if (typeof (cb) === 'undefined') {
                cb = function () {};
            }
            else if (typeof(cb) !== 'function') {
                throw "Parameter 1 expected to be a function";
            }
            
            
            this.el = $('<button></button>');
            this.el.text(this.config.label);
            if (this.config.disabled) {
                this.el.prop('disabled', true);
            }
            if (this.config.click) {
                this.el.click(this.config.click);
            }
            cb.call(this);
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
            if (key === 'label') {
                if (typeof (value) !== 'undefined') {
                    this.config.label = value;
                    
                    if (this.el !== null) {
                        this.el.text(value);
                    }
                    return value;
                }
                else {
                    return this.config.label;
                }
            }
            else {
                this._super(key, value);
            }
        }
        
    }));
    
});