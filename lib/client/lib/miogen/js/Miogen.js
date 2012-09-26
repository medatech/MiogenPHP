/**
 * Singleton miogen class to create an initialise the main application view model with
 * helper methods for error handling, asynchronous script loading and JavaScript object
 * querying.
 * 
 * @class Miogen
 * @static
 **/
Miogen = Class.extend({
    
    /**
     * The configuration object for the application.
     * @property cfg
     * @type {Object}
     * @default null
     * @private
    **/
    config: null,
    
    /**
     * Keeps track of waiting requests for the various modules.
     * @property defineCallbacks
     * @type {Function[]}
     * @default []
     * @private
     */
    defineCallbacks: null,
    
    /**
     * The active view model for the application.
     * @property viewModel
     * @type {Miogen.ViewModel.BaseViewModel}
     * @default null
     * @private
     */
    viewModel: null,
    
    
    /**
     * Construct a new Miogen instance.
     * 
     * @method construct
     * @protected
     * @constructor
     */
    construct: function () {
        this.defineCallbacks = {};
    },
    
    /**
     * Called on the initialisation of the Miogen class and is responsible for loading
     * the view definition fle from the server and initialising the page view model.
     * 
     * @method init
     * @param {Function} [cb] A callback function to be called when the iniailise has completed.
     * 
     * @example
     *     Miogen.init(function () {
     *         Miogen.renderTo($('#view-body'));
     *         Miogen.run();
     *     });
     **/
    init: function (cb) {
        var t = this;
        
        if (typeof (cb) === 'undefined') {
            cb = function () {};
        }
        else if (typeof(cb) !== 'function') {
            throw "Parameter 1 expected to be a function";
        }
        
        // Load the classes required by Miogen
        this.require(['Data.MiogenStore', 'ViewModel.PageViewModel'], function () {
            // Now make sure the page is fully loaded
            $(document).ready(function () {
                
                // Load the page view
                $.ajax({
                    url: t.config.viewFile,
                    contentType: 'text/json',
                    success: function (data) {
                        if (typeof (data) === 'string') {
                            data = $.parseJSON(data);
                        }
                        t.viewModel = new Miogen.ViewModel.PageViewModel(data);
                        t.viewModel.build(function () {
                            cb.call(t);
                        });
                    },
                    error: function (xhr, text, error) {
                        t.logError(error);
                   }
                })
            })
        });
    },
    
    /**
     * Standardised method to record application errors with the option to notify the user.
     * 
     * @method logError
     * @param {String|Exception} message The error message.
     * @param {Boolean} notifyUser Optional default false. When true, the user will be notified of the
     *                             error.
     * 
     * @example
     *     Miogen.logError('Unable to create account as the password is too short', true);
     * 
     * @example
     *     try {
     *         doSomething();
     *     }
     *     catch (ex) {
     *         Miogen.logError(ex);
     *     }
     */
    logError: function (message, notifyUser) {
        if (typeof (notifyUser) === 'undefined') {
            notifyUser = false;
        }
        
        // TODO: Error reporting could be captured here
        if (notifyUser) {
            alert(message);
        }
    },
    
    /**
     * Runs the Miogen application by calling the view model to initialise all it's data.
     * 
     * @method run
     * @example
     *     Miogen.init(function () {
     *         Miogen.renderTo($('#view-body'));
     *         Miogen.run();
     *     });
     */
    run: function () {
        this.viewModel.initData();
    },
    
    /**
     * Call the collection of components to render to the supplied dom element.
     * 
     * @method renderTo
     * @param {jQuery object} el The jQuery object to render the view to.
     * 
     * @example
     *     Miogen.init(function () {
     *         Miogen.renderTo($('#view-body'));
     *         Miogen.run();
     *     });
     **/
    renderTo: function (el) {
        if (this.viewModel !== null) {
            this.viewModel.renderTo(el);
        }
        else {
            throw 'Page view model has not been initialised';
        }
    },
    
    /**
     * Replaces the application configuration object with a new one.
     * @method setConfig
     * @param {Object} cfg The configuration object to replace it with.
     */
    setConfig: function (cfg) {
        this.config = cfg;
    },
    
    /**
     * Sets or gets and application configuration attribute.
     * 
     * @method attr
     * @param {String} key The attribute to set or get.
     * @param {mixed} [value] If supplied, the attribute will be set to this value.
     * @return {mixed} The attribute after any modifications.
     */
    attr: function (key, value) {
        if (typeof (value) !== 'undefined') {
            this.config[key] = value;
            return value;
        }
        else {
            return this.config[key] || null;
        }
    },
    
    /**
     * Load a remote JavaScript file and be notified when it has successfully been loaded.
     * @method loadScript
     * @param {String} url The URL of the script to load.
     * @param {Function} [cb] A callback to be notified when the script has loaded.
     */
    loadScript: function (url, cb) {
        var t = this, head, script;
        
        if (typeof (cb) === 'undefined') {
            cb = function (){};
        }
        
        head = document.getElementsByTagName('head')[0];
        script = document.createElement('script');
        script.type = 'text/javascript';
        
        script.onreadystatechange= function () {
            if (this.readyState == 'complete') {
                cb.call(t);
            }
        }
        script.onload = function () {
            cb.call(t);
        };
        
        script.src = url;
        head.appendChild(script);
    },
    
    /**
     * Define a new class within the Miogen application.
     * @method define
     * @param {String} name The fully qualified name of the class being defined.
     * @param {Class} classDef The class definition of which new instances of this class can be created by.
     */
    define: function (name, classDef) {
        var i, parts, ns;
            
        parts = name.split('.');
        ns = this;
        for (i = 0; i < parts.length; i += 1) {
            if (i === parts.length - 1) {
                // This is the class name
                ns[parts[i]] = classDef;
                
                // See if there are any callbacks waiting for this module
                if (this.defineCallbacks.hasOwnProperty(name)) {
                    while (this.defineCallbacks[name].length > 0) {
                        this.defineCallbacks[name].splice(0, 1)[0].call(this, classDef);
                    }
                }
            }
            else {
                if (!ns.hasOwnProperty(parts[i])) {
                    // Create the namespace
                    ns[parts[i]] = {};
                }
                ns = ns[parts[i]];
            }
        }
    },
    
    /**
     * Loads the supplied classes if not loaded and calls the callback when they are available for use.
     * @method require
     * @param {String[]} names Array of fully qualified class names to ensure are loaded.
     * @param {Function} [cb] The callback to call when the classes are ready for use.
     */
    require: function (names, cb) {
        var i, t, callbackCount = 0;
        
        if (typeof (cb) === 'undefined') {
            cb = function () {};
        }
        
        if (typeof (names) === 'string') {
            names = [names];
        }
        
        for (i = 0; i < names.length; i += 1) {
            this.requireModule(names[i], function () {
                callbackCount += 1;
                if (names.length === callbackCount) {
                    cb.call(t);
                }
            });
        }
    },
    
    /**
     * Ensures that a specific modules has been loaded and calls the callback when it's ready for use.
     * @method requireModule
     * @param {String} name The fully qualified name of the class that is required.
     * @param {Function} cb The callback to call when the class is ready for use.
     */
    requireModule: function (name, cb) {
        var i, parts, ns, classDef;
        
        if (typeof (cb) === 'undefined') {
            cb = function () {};
        }
        
        parts = name.split('.');
        ns = this;
        classDef = null;
        for (i = 0; i < parts.length; i += 1) {
            if (ns.hasOwnProperty(parts[i])) {
                // Create the namespace
                ns = ns[parts[i]];
                classDef = ns;
            }
            else {
                // Load the module script and try again
                classDef = null;
                // Register the define callback for when the module is ready
                if (this.defineCallbacks.hasOwnProperty(name)) {
                    this.defineCallbacks[name].push(cb);
                }
                else {
                    this.defineCallbacks[name] = [cb];
                    // This is the first request for this class, so load the script
                    this.loadScript(this.config.miogenUrl + '/lib/miogen/js/' + name.replace('.', '/') + '.js');
                }
                
                break;
            }
        }
        
        if (classDef !== null) {
            cb.call(this, classDef);
        }
    },
    
    /**
     * Shallow merge of a JavaScript object by overlaying one onto the other.
     * @method mixIn
     * @param {Object} target The master object that will be updated with the overlay.
     * @param {Object} [overlay] The object whose properties will be overlaid onto the master object.  If omitted, no action will be taken.
     */
    mixIn: function (target, overlay) {
        if (typeof (overlay) !== 'undefined') {
            for (var key in overlay) {
                if (overlay.hasOwnProperty(key)) {
                    target[key] = overlay[key];
                }
            }
        }
    },
    
    /**
     * Bind to an object's function and have a callback called when it has completed executing.
     * @method bind
     * @param {Object} who The owner of this bind which can later be used to unbind.
     * @param {Object} obj The target object which is being bound to.
     * @param {String} method The name of the method that will be bound to.
     * @param {Function} cb The callback method to call when the binded method has been executed.  The arguments
     *                      of this callback will be the same of the method being bound.
     */
    bind: function (who, obj, method, cb) {
        var currentMethod = obj[method], newMethod;
        if (typeof (currentMethod) === 'undefined') {
            throw "Unable to bind, method " + method + " doesn't exist on object";
        }
        
        if (currentMethod.hasOwnProperty('_watchers')) {
            currentMethod._watchers.push({
                who: who,
                cb: cb
            });
        }
        else {
            newMethod = function () {
                var args = arguments;
                
                // Call the original method
                currentMethod.apply(obj, args);
                
                // Notify all the watchers
                $.each(newMethod._watchers, function (index, watcher) {
                    watcher.cb.apply(obj, args);
                });
            };
            
            newMethod._watchers = [{
                who: who,
                cb: cb
            }];
            
            obj[method] = newMethod;
        }
    },
    
    /**
     * Unbind to an object's method.
     * @method unbind
     * @param {Object} who The owner of the original bind.
     * @param {Object} obj The object that is being unbound.
     * @param {String} methtod The method that is to be unbound.
     */
    unbind: function (who, obj, method) {
        var func = obj[method], i;
        if (typeof (method) === 'undefined') {
            throw "Unable to unbind, method " + method + " doesn't exist on object";
        }
        
        if (func.hasOwnProperty('_watchers')) {
            for (i = func._watchers.length - 1; i >= 0; i -= 1) {
                if (func._watchers[i].who === who) {
                    func._watchers.splice(i, 1);
                }
            }
        }
    },
    
    /**
     * Gets the currently active view model.
     * @method getViewModel
     * @return {Miogen.ViewModel.BaseViewModel}
     */
    getViewModel: function () {
        return this.viewModel;
    },
    
    /**
     * Set the value of a JavaScript object identified by the query.
     * @method setObjectValue
     * @param {Object} objectContext The object that is to be modified.
     * @param {String} query The string query that is to identify the value to be modified.
     * @param {mixed} value The value that is to be set.
     */
    setObjectValue: function (objectContext, query, value) {
        var queryParts, part, i, match, key, index, objectContext, value;
        
        if (typeof (defaultValue) === 'undefined') {
            defaultValue = null;
        }
        
        queryParts = query.split('.');
        for (i = 0; i < queryParts.length; i += 1) {
            // See if this is an array
            part = queryParts[i];
            
            match = part.match(/([^[]*)\[([0-9]*)\]/);
            if (match !== null && match.length === 3) {
                // It's an array index
                key = match[1];
                index = +match[2];
            }
            else {
                key = part;
                index = null;
            }
            
            // If the key doesn't exist, create it
            if (!objectContext.hasOwnProperty(key)) {
                // Make sure it's not the last one, as this just then needs to set the value
                // Unless it's an array index, then we need to create the array
                if (i < queryParts.length - 1 || index !== null) {
                    objectContext[key] = index !== null ? [] : {};
                }
            }
            
            if (i < queryParts.length - 1) {
                if (index !== null) {
                    objectContext = objectContext[key][index];
                }
                else {
                    objectContext = objectContext[key];
                }
            }
            else {
                if (index !== null) {
                    objectContext[key][index] = value;
                }
                else {
                    objectContext[key] = value;
                }
                break;
            }
        }
    },
    
    /**
     * Gets an object value denoted by a given query.
     * @method queryObject
     * @param {Object} objectContext The object that is to be queried.
     * @param {String} query The string query to identify teh value to return.
     * @param {mixed} [defaultValue] The default value to return if the query cannot find a value. Default's to null.
     * @return {mixed} The value denoted by the query or the default value if not found.
     */
    queryObject: function (objectContext, query, defaultValue) {
        var queryParts, part, i, match, key, index, objectContext, value;
        
        if (typeof (defaultValue) === 'undefined') {
            defaultValue = null;
        }
        
        queryParts = query.split('.');
        for (i = 0; i < queryParts.length; i += 1) {
            // See if this is an array
            part = queryParts[i];
            
            match = part.match(/([^[]*)\[([0-9]*)\]/);
            if (match !== null && match.length === 3) {
                // It's an array index
                key = match[1];
                index = +match[2];
            }
            else {
                key = part;
                index = null;
            }
            
            if (objectContext.hasOwnProperty(key)) {
                if (index !== null) {
                    objectContext = objectContext[key][index];
                }
                else {
                    objectContext = objectContext[key];
                }
                
                if (i === queryParts.length - 1) {
                    // Found the last one
                    value = objectContext;
                    break;
                }
            }
            else {
                value = defaultValue;
                break;
            }
        }
        return value;
    }
});

Miogen = new Miogen();