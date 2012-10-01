/*globals Miogen,$ */

/**
 * A Textbox UI component.
 * 
 * @class Miogen.Component.Textbox
 * @extends Miogen.Component.BaseComponent
 * @constructor
 */
Miogen.require(['Component.BaseComponent'], function () {
    
    Miogen.define('Component.Textbox', Miogen.Component.BaseComponent.extend({
        
        construct: function (cfg) {
            var config = {
                value: '',
                disabled: false
            }
            
            Miogen.mixIn(config, cfg);
            
            this._super(config);
        },
    
        build: function (cb) {
            var t = this;
            this.el = $('<input type="text"></input>');
            this.el.val(this.config.value);
            if (this.config.disabled) {
                this.el.prop('disabled', true);
            }
            this.el.change(function () {
                t.onChange($(this).val());
            });
            this.el.keyup(function () {
                t.onChange($(this).val());
            });
            cb.call(this);
        },
        
        onChange: function (value) {
            
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
            if (key === 'value') {
                if (typeof (value) === 'undefined') {
                    // Get the current value
                    if (this.el !== null) {
                        return this.el.val();
                    }
                    else {
                        return this.config.value || null;
                    }
                }
                else {
                    // Set the value
                    if (this.el !== null) {
                        this.el.val(value);
                    }
                    else {
                        this.config.value = value;
                    }
                    return value;
                }
            }
            else {
                return this._super(key, value);
            }
        }
        
    }));
    
});