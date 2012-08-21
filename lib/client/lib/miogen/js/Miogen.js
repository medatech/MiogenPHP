Miogen = Class.extend({
    
    cfg: null,
    
    // Used to keep track of waiting requests for the various modules
    defineCallbacks: null,
    
    pageViewModel: null,
    
    construct: function () {
        this.defineCallbacks = {};
    },
    
    init: function (cb) {
        var t = this;
        
        // Load the classes required by Miogen
        this.require(['Data.MiogenModel', 'ViewModel.PageViewModel'], function () {
            // Now make sure the page is fully loaded
            $(document).ready(function () {
                
                // Load the page view
                $.ajax({
                    url: t.cfg.viewFile,
                    contentType: 'text/json',
                    success: function (data) {
                        t.pageViewModel = new Miogen.ViewModel.PageViewModel(data);
                        cb.call(t);
                    },
                    error: function (xhr, text, error) {
                        console.log('Error');
                        console.log(arguments);
                    }
                })
            })
        })
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
        if (this.pageViewModel !== null) {
            this.pageViewModel.renderTo(el);
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
                        this.defineCallbacks[name].splice(0, 1)[0].call(this);
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
        var i, parts, ns;
            
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
                }
                
                this.loadScript(this.cfg.miogenUrl + '/lib/miogen/js/' + name.replace('.', '/') + '.js');
                break;
            }
        }
        
        if (classDef !== null) {
            cb.call(this, classDef);
        }
    }
});

Miogen = new Miogen();