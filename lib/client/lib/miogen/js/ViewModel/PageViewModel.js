Miogen.require(['ViewModel.BaseViewModel', 'Data.MiogenModel'], function () {
    Miogen.define('ViewModel.PageViewModel', Miogen.ViewModel.BaseViewModel.extend({
        
        layoutEl: null,
        
        model: null,
        
        construct: function (cfg) {
            this._super(cfg);
            
            this.model = new Miogen.Data.MiogenModel(Miogen.config('apiUrl'));
        },
        
        renderTo: function (el) {
            document.title = this.cfg.title;
            this.buildPage();
            el.append(this.layoutEl);
            
            
            this.model.get({
                url: '/API/1/',
                success: function (items) {
                    console.log(items);
                },
                error: function () {
                    console.log(arguments);
                }
            });
        },
        
        buildPage: function () {
            this.layoutEl = $('<div>Layout</div>');
        }
    }));
});