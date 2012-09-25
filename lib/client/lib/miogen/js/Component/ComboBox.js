/*globals Miogen,$ */

/**
 * A Combo Box UI component.
 * 
 * @class Miogen.Component.ComboBox
 * @extends Miogen.Component.BaseComponent
 * @constructor
 */
Miogen.require(['Component.BaseComponent'], function () {
    
    Miogen.define('Component.ComboBox', Miogen.Component.BaseComponent.extend({
        
        options: null,
        
        construct: function (cfg) {
            var config = {
                query: null,
                value: '',
                disabled: false,
                options: []
            }
            
            Miogen.mixIn(config, cfg);
            
            this.options = config.options;
            
            this._super(config);
        },
        
        build: function (cb) {
            var t = this;
            
            this.el = $('<select></select>');
            if (this.config.disabled) {
                this.el.prop('disabled', true);
            }
            
            this.el.change(function () {
                t.onChange($(this).val());
            });
            
            if (this.config.value === null) {
                // This needs to be set, so add a blank option
                this.options.unshift({
                    value: null,
                    label: ''
                });
            }
            
            $.each(this.options, function (index, optionData) {
                t.renderOption(optionData);
            });
            cb.call(this);
        },
        
        addOption: function (value, label) {
            var optionData;
            
            optionData = {
                value: value,
                label: label
            };
            this.options.push(optionData);
            
            // Render it if it's a late addition
            if (this.el !== null) {
                this.renderOption(optionData);
            }
        },
        
        renderOption: function (optionData) {
            var option = $('<option></option>');
            option.text(optionData.label);
            option.attr('value', optionData.value);
            this.el.append(option);
            
            // Set the value if this is the selected value
            if (this.config.value === optionData.value) {
                this.attr('value', optionData.value);
            }
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
                        return this.el.val(value);
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