/*globals Miogen,$ */

/**
 * A Checkbox UI component.
 * 
 * @class Miogen.Component.Checkbox
 * @extends Miogen.Component.BaseComponent
 * @constructor
 */
Miogen.require(['Component.BaseComponent'], function () {
    
    Miogen.define('Component.Checkbox', Miogen.Component.BaseComponent.extend({
        
        /**
         * Construct a new button component.
         * 
         * @method construct
         * @param {Object} [cfg] The configuration object for this checkbox. See Miogen.Component.BaseComponent construct for additional options.
         *     @param {String} [cfg.label] The checkbox label. Defaults to empty string.
         *     @param {Boolean} [cfg.checked] Whether the checkbox should be checked or not. Defaults to false.
         * 
         * @example
         *     var checkbox = new Miogen.Component.Checkbox({
         *         label: 'Agree to terms'
         *     });
         */
        construct: function (cfg) {
            var config = {
                label: '',
                checked: false
            }
            
            Miogen.mixIn(config, cfg);
            
            this._super(config);
        },
        
        /**
         * Builds the &lt;input type="checkbox"&gt; HTML element label in a surrounding &lt;div&gt; and the specified properties in the constructor.
         * 
         * @method build
         * @param {Function} [cb] Callback to call when the component has been built.
         * 
         * @example
         *     var checkbox = new Miogen.Component.Checkbox({
         *         label: 'Agree to terms'
         *     });
         *     
         *     checkbox.build(function () {
         *         alert('Checkbox has been built');
         *     });
         */
        build: function (cb) {
            var t = this;
            this.el = $('<div class="checkbox"><label><input type="checkbox"' + (this.config.checked ? ' checked' : '') + '><span></span></label></div>');
            $('label span', this.el).text(this.config.label);
            if (this.config.disabled) {
                $('input', this.el).prop('disabled', true);
            }
            
            $('input', this.el).change(function () {
                t.onChange(t.attr('value'));
            });
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
            if (key === 'value') {
                if (typeof (value) === 'undefined') {
                    // Get the current value
                    if (this.el !== null) {
                        return $('input', this.el).is(':checked');
                    }
                    else {
                        return this.config.value || null;
                    }
                }
                else {
                    // Set the value
                    if (this.el !== null) {
                        $('input', this.el).prop('checked', value === true);
                    }
                    else {
                        this.config.value = value;
                    }
                    return value;
                }
            }
            else if (key === 'label') {
                if (typeof (value) !== 'undefined') {
                    this.config.label = value;
                    
                    if (this.el !== null) {
                        $('label span', this.el).text(value);
                    }
                    return value;
                }
                else {
                    return this.config.label;
                }
            }
            else {
                return this._super(key, value);
            }
        }
    }));
    
});