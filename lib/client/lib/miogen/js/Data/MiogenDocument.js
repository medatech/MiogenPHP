Miogen.require(['Data.MiogenItem',
                'Data.MiogenTemplate'], function () {
    Miogen.define('Data.MiogenDocument', Class.extend({

        col: null,
        
        items: null,

        construct: function (col) {
            var t = this;
            this.col = col.collection;
            
            this.items = [];
            if (this.col.hasOwnProperty('items')) {
                $(this.col.items).each(function (index, item) {
                    t.items.push(new Miogen.Data.MiogenItem(item));
                });
            }
        },

        getPrompt: function () {
            if (this.col.hasOwnProperty('prompt')) {
                return this.col.prompt;
            }
            else {
                return null;
            }
        },

        getUri: function () {
            return this.col.href;
        },

        getItems: function () {
            return this.items;
        },
        
        getTemplate: function (/* optional */ name) {
            if (this.col.hasOwnProperty('templates') && this.col.templates.length > 0) {
                return new Miogen.Data.MiogenTemplate(this.col.templates[0]);
            }
            else {
                return null;
            }
        }
    }));
});