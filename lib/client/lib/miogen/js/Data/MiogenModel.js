Miogen.define('Data.MiogenStore', Class.extend({

    collections: null,
    items: null,

    construct: function () {
        this.collections = {};
        this.items = {};
    },
    
    set: function (doc) {
        var uri, isCollection, items, item, i, collectionItems = [];
        
        uri = doc.collection.href;
        isCollection = (uri.lastIndexOf('/') === uri.length - 1);
        
        if (isCollection) {
            // Store all the items, then update the collection items with links to the items objects
            if (doc.collection.hasOwnProperty('items')) {
                items = doc.collection.items;
                for (i = 0; i < items.length; i += 1) {
                    item = items[i];
                    
                    // Only store the item if we don't have it in the item's cache
                    if (this.items.hasOwnProperty(item.href)) {
                        item = this.items[item.href];
                    }
                    else {
                        this.items[item.href] = item;
                    }
                    
                    // Store a back reference to the collection doc
                    if (!item.hasOwnProperty('_collections')) {
                        item._collections = [];
                    }
                    item._collections.push(doc);
                    
                    // Add the item to the collection items
                    collectionItems.push(item);
                }
                // Update the collection to the list of items
                doc.collection.items = collectionItems;
            }
            else {
                // If this item already exists, we want to update it (and the references to the collections)
            }
        }
        
    },
    
    get: function (uri) {
        
    }
}));