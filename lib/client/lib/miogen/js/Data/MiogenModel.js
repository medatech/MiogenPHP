Miogen.define('Data.MiogenModel', Class.extend({

    documents: null,
    items: null,
    templates: null,

    construct: function () {
        this.documents = {};
        this.items = {};
        this.templates = {};
    },
    
    // Returns the remapped miogen document data
    set: function (/* MiogenDocument|raw Document */ doc) {
        var uri, path, isCollection, items, colItem, cacheItem, i, collectionItems = [], isNew, colUri;
        
        uri = new URI(doc.collection.href);
        path = uri.path();
        // It's a collection if it ends in a /
        isCollection = (path.lastIndexOf('/') === path.length - 1);
        
        // Store all the items, then update the collection items with links to the items objects
        if (doc.collection.hasOwnProperty('items')) {
            items = doc.collection.items;
            for (i = 0; i < items.length; i += 1) {
                colItem = items[i];
                
                // Only store the item if we don't have it in the item's cache
                if (this.items.hasOwnProperty(colItem.href)) {
                    cacheItem = this.items[colItem.href];
                    
                    // Replace the cache item if it's the full version, or if they are both partial
                    if (!isCollection || isCollection && !cacheItem.full) {
                        cacheItem.item = colItem;
                        // Notify all the existing collections that the item has been modified
                        for (colUri in cacheItem.collections) {
                            // Notify all but this collection
                            if (cacheItem.collections.hasOwnProperty(colUri) && colUri !== doc.collection.href) {
                                this.onCollectionItemUpdate(cacheItem.item);
                            }
                        }
                    }
                }
                else {
                    cacheItem = {
                        item: colItem, // The document item
                        full: isCollection, // Whether it's a partial or full representation
                        collections: {}
                    };
                    this.items[colItem.href] = cacheItem;
                }
                
                // Store a back reference to the collection doc
                cacheItem.collections[uri] = doc;
                
                // Add the item to the collection items
                collectionItems.push(cacheItem);
            }
            // Update the collection to the list of items
            doc.collection.items = collectionItems;
        }
        
        isNew = this.documents.hasOwnProperty(doc.collection.href);
        this.documents[uri] = doc;
        
        if (isNew) {
            this.onDocumentAdd(doc);
        }
        else {
            this.onDocumentUpdate(doc);
        }
        
        return doc;
    },
    
    get: function (uri) {
        var item = this.documents[uri];
        if (typeof (item) === 'undefined') {
            return null;
        }
        else {
            return item;
        }
    },
    
    unset: function (uri) {
        var doc, item, uriObj, isCollection, path, i;
        
        doc = this.get(uri);
        if (doc !== null) {
            uriObj = new URI(uri);
            path = uriObj.path();
            // It's a collection if it ends in a /
            isCollection = (path.lastIndexOf('/') === path.length - 1);
            
            if (isCollection) {
                // Remove the back reference in the items
                if (doc.collection.hasOwnProperty('items')) {
                    for (i = 0; i < doc.collection.items.length; i += 1) {
                        delete item.collections.items[i][uri];
                    }
                }
            }
            else {
                // It's an item, so this means we want to remove it from all the collections
                if (doc.collection.hasOwnProperty('items')) {
                    for (i = doc.collection.items.length - 1; i >= 0; i -= 1) {
                        this.removeDataItem(doc.collection.items[i]);
                    }
                }
            }
            
            delete this.documents[uri];
        }
    },
    
    removeDataItem: function (item) {
        var colName;
        
        // Now go through all the owning collections and remove it from them
        for (colName in item.collections) {
            if (item.collections.hasOwnProperty(colName)) {
                this.removeItemFromCollection(item);
            }
        }
        
        // Remove the data item from the cache
        delete this.items[item.item.href];
    },
    
    removeItemFromCollection: function (item) {
        var i;
        
        if (item.collection.hasOwnProperty('items')) {
            for (i = item.collection.items.length - 1; i >= 0; i -= 1) {
                if (item.collection.items[i] === item) {
                    item.collection.items.splice(i, 0);
                }
                
                // TODO: Publish modify event for the collection
            }
        }
    },
    
    onDocumentAdd: function (doc) {
        console.log('Document added', doc);
    },
    
    onDocumentRemove: function (doc) {
        console.log('Document removed', doc);
    },
    
    onDocumentUpdate: function (doc) {
        console.log('Document updated', doc);
    },
    
    onCollectionItemAdd: function (col, item) {
        console.log('Collection item added', col, item);
    },
    
    onCollectionItemRemove: function (col, item) {
        console.log('Collection item removed', col, item);
    },
    
    onCollectionItemUpdate: function (col, item) {
        console.log('Collection item updated', col, item);
    }
}));