var JSONUtils = {
    "getJSON": function(obj, includeCircRefKeys) {
        try {
            return JSON.stringify(obj, null, 5);
        } catch (circRef) {
            /* circular reference exists, proceed below with additional logic */
        }
        var nodeProcessedIndicator = "[.....Node.Processed.....]";
        var circRefIndicator = "[!#CircularReference#!]";
        var writeAllowedIndicator = "[.....Write.Allowed.....]";
        var _cache = [];
        var str = JSON.stringify(obj, function(key, value) {
            try {
                JSON.stringify(value);
                return value;
            } catch (stringifyErr) {
                if (value && typeof value === "object") {
                    var isWriteAllowed = true;
                    try {
                        if (!value[nodeProcessedIndicator]) {
                            isWriteAllowed = true;
                            value[writeAllowedIndicator] = true;
                            try {
                                delete value[writeAllowedIndicator];
                            } catch (deleteError) {
                                value[writeAllowedIndicator] = undefined;
                            }
                        }
                    } catch (writeError) {
                        isWriteAllowed = false;
                    }
                    if (isWriteAllowed && !value[nodeProcessedIndicator]) {
                        value[nodeProcessedIndicator] = true;
                        _cache.push(value);
                        return value;
                    } else {
                        return circRefIndicator;
                    }
                } else {
                    return value;
                }
            }
        });
        for (var i = 0; i < _cache.length; i++) {
            if (_cache[i] && _cache[i][nodeProcessedIndicator]) {
                try {
                    delete _cache[i][nodeProcessedIndicator];
                } catch (deleteError) {
                    _cache[i][nodeProcessedIndicator] = undefined;
                }
            }
        }
        _cache = null;
        var _obj = JSON.parse(str);
        return JSON.stringify(_obj, function(key, value) {
            if (value && typeof value === "object") {
                if (!includeCircRefKeys) {
                    if (Array.isArray(value)) {
                        var _newArray = [];
                        for (var i = 0; i < value.length; i++) {
                            if (value[i] !== circRefIndicator) {
                                _newArray.push(value[i]);
                            }
                        }
                        value = _newArray;
                    } else {
                        Object.getOwnPropertyNames(value).forEach(function(k) {
                            if (value[k] === circRefIndicator) {
                                delete value[k];
                            }
                        });
                    }
                }
                if (value[nodeProcessedIndicator]) {
                    delete value[nodeProcessedIndicator];
                }
                return value;
            } else {
                return value;
            }
        }, 5);
    }
};

/* Usage Details: */
/*
var inputObject = {
    // The input object which may or may not have circular/cyclic references
};

JSONUtils.getJSON(inputObject);
*/
