Miogen.require(['Data.MiogenItem',
                'Data.MiogenTemplate',
                'Data.MiogenQuery'], function () {
                
    Miogen.define('Data.MiogenDocument', Class.extend({

        col: null,
        
        items: null,

        construct: function (col) {
            var t = this;
            this.col = col.collection;
            
            this.items = null;
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
            var t = this;
            
            if (this.items === null) {
                // Load the items and cache the MiogenItem if not done so already
                this.items = [];
                if (this.col.hasOwnProperty('items')) {
                    $(this.col.items).each(function (index, item) {
                        if (!item.hasOwnProperty('_item')) {
                            item._item = new Miogen.Data.MiogenItem(item, t.getTemplate(item.template));
                        }
                        t.items.push(item._item);
                    });
                }
            }
            
            return this.items;
        },
        
        getItem: function (index) {
            var items = this.getItems();
            
            if (items.length > index) {
                return items[index];
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
                        if (templateData.template.name === 'name') {
                            template = new Miogen.Data.MiogenTemplate(templateData);
                        }
                    });
                }
            }
            
            return template;
        },
        
        getQueryByRel: function (rel) {
            var query = null;
            if (this.col.hasOwnProperty('queries')) {
                $.each(this.col.queries, function (index, q) {
                    if (q.rel === rel) {
                        query = new Miogen.Data.MiogenQuery(q);
                    }
                })
            }
            return query;
        },
        
        commit: function () {
            $.each(this.getItems(), function (index, item) {
                item.commit();
            });
        },
        
        rollback: function () {
            $.each(this.getItems(), function (index, item) {
                item.rollback();
            });
        }
    }));
});