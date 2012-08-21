Miogen.define('ViewModel.BaseViewModel', Class.extend({

    cfg: null,
    
    construct: function (cfg) {
        this.cfg = cfg;
        console.log('Base View Model', cfg);
    }


}));