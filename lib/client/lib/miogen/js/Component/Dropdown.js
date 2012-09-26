/*globals Miogen,$ */

/**
 * A Dropdown UI component.
 * 
 * @class Miogen.Component.Dropdown
 * @extends Miogen.Component.BaseComponent
 * @constructor
 */
Miogen.require(['Component.BaseComponent'], function () {
    
    Miogen.define('Component.Dropdown', Miogen.Component.BaseComponent.extend({
        
       /**
        * The stored options for the dropdown.
        * @property options
        * @private
        * @type {Object[]}
        * @default []
        **/
        options: null,
        
        /**
         * Construct a new dropdown component.
         * 
         * @method construct
         * @param {Object} [cfg] The configuration object for this dropdown. See Miogen.Component.BaseComponent construct for additional options.
         *     @param {String} [cfg.value] The value to be set on the dropdown when all the options have been added.
         *     @param {Object[]} [cfg.options] The list of options to render. Defaults to empty list.
         * 
         * @example
         *     var dropdown = new Miogen.Component.Dropdown({
         *         value: '18-25',
         *         options: [
         *             {value: '<18', label: 'Under 18'},
         *             {value: '18-25', label: '18 to 25'},
         *             {value: '26-40', label: '26 to 40'},
         *             {value: '>40', label: 'Over 40'}
         *         ]
         *     });
         */
        construct: function (cfg) {
            var config = {
                value: '',
                options: []
            }
            
            Miogen.mixIn(config, cfg);
            
            this.options = config.options;
            
            this._super(config);
        },
        
        /**
         * Builds the &lt;select&gt; HTML element with the specified properties in the constructor.
         * 
         * @method build
         * @param {Function} [cb] Callback to call when the component has been built.
         * 
         * @example
         *     var dropdown = new Miogen.Component.Dropdown({
         *         value: '18-25',
         *         options: [
         *             {value: '<18', label: 'Under 18'},
         *             {value: '18-25', label: '18 to 25'},
         *             {value: '26-40', label: '26 to 40'},
         *             {value: '>40', label: 'Over 40'}
         *         ]
         *     });
         *     
         *     dropdown.build(function () {
         *         alert('Dropdown has been built');
         *     });
         */
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
        
        /**
         * Adds a new option to the end of the dropdown.
         * 
         * @method addOption
         * @param {String} value A string representation of the value.
         * @param {String} label The option label to display in the dropdown.
         */
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
        
        /**
         * Renders an individual option to the end of the dropdown.
         * 
         * @method renderOption
         * @private
         * @param {String} value A string representation of the value.
         * @param {String} label The option label to display in the dropdown.
         */
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