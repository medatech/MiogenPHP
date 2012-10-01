/*globals Miogen,$ */

/**
 * A label UI component.
 * 
 * @class Miogen.Component.Label
 * @extends Miogen.Component.BaseComponent
 * @constructor
 */
Miogen.require(['Component.BaseComponent'], function () {
    
    Miogen.define('Component.Label', Miogen.Component.BaseComponent.extend({
        
        construct: function (cfg) {
            var config = {
                text: 'Label',
                visible: true,
                className: null
            }
            
            Miogen.mixIn(config, cfg);
            
            this._super(config);
        },
    
        build: function (cb) {
            this.el = $('<span></span>');
            this.el.text(this.config.text);
            if (this.config.className !== null) {
                this.el.addClass(this.config.className);
            }
            if (!this.config.visible) {
                this.el.addClass('hidden');
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