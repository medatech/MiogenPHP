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
                    t.items.push(new Miogen.Data.MiogenItem(item, t.getTemplate(item.template)));
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
        
        getItem: function (index) {
            if (this.items.length > index) {
                return this.items[index];
            }
            else {
                return null;
            }
        },
        
        getTemplate: function (/* optional */ name) {
            var template = null;
            
            if (this.col.hasOwnProperty('templates')) {
                if (typeof (name) === 'undefined') {
                    if (this.col.templates.length > 0) {
                        template = new Miogen.Data.MiogenTemplate(this.col.templates[0]);
                    }
                }
                else {
                    $.each(this.col.templates, function (index, templateData) {
                        if (templateData.name === 'name') {
                            template = new Miogen.Data.MiogenTemplate(templateData);
                        }
                    });
                }
            }
            
            return template;
        }
    }));
});