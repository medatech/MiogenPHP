Miogen = Class.extend({
    
    cfg: null,
    
    // Used to keep track of waiting requests for the various modules
    defineCallbacks: null,
    
    viewModel: null,
    
    construct: function () {
        this.defineCallbacks = {};
    },
    
    init: function (cb) {
        var t = this;
        
        // Load the classes required by Miogen
        this.require(['Data.MiogenStore', 'ViewModel.PageViewModel'], function () {
            // Now make sure the page is fully loaded
            $(document).ready(function () {
                
                // Load the page view
                $.ajax({
                    url: t.cfg.viewFile,
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
//                        console.log('Error');
//                        console.log(arguments);
                    }
                })
            })
        });
    },
    
    run: function () {
        this.viewModel.initData();
    },
    
    config: function (key, /* optional */ value) {
        if (typeof (value) === 'undefined') {
            return this.cfg[key];
        }
        else {
            this.cfg[key] = value;
            return value;
        }
    },
    
    renderTo: function (el) {
        if (this.viewModel !== null) {
            this.viewModel.renderTo(el);
        }
        else {
            throw 'Page view model has not been initialised';
        }
    },
    
    setConfig: function (cfg) {
        this.cfg = cfg;
    },
    
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
    
    require: function (names, cb) {
        var i, t, callbackCount = 0;
        
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
    
    requireModule: function (name, cb) {
        var i, parts, ns, classDef;
            
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
                    this.loadScript(this.cfg.miogenUrl + '/lib/miogen/js/' + name.replace('.', '/') + '.js');
                }
                
                break;
            }
        }
        
        if (classDef !== null) {
            cb.call(this, classDef);
        }
    },
    
    mixIn: function (target, overlay) {
        for (var key in overlay) {
            if (overlay.hasOwnProperty(key)) {
                target[key] = overlay[key];
            }
        }
    },
    
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
    
    getViewModel: function () {
        return this.viewModel;
    },
    
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
    
    queryObject: function (objectContext, query, /* optional */ defaultValue) {
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