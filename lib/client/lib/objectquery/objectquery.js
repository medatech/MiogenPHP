var objectQuery = function (objectContext, query, /* optional */ defaultValue) {
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
};