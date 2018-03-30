var JSONUtils = {
    "getJSON": function(obj, includeCircRefKeys) {
        try {
            return JSON.stringify(obj);
        } catch (circRef) {
            /* circular reference exists, proceed below with additional logic */
        }
        var nodeProcessedIndicator = "[.....Node.Processed.....]";
        var circRefIndicator = "[!#CircularReference#!]";
        var _cache = [];
        var str = JSON.stringify(obj, function(key, value) {
            if (value && typeof value === "object") {
                var isWriteAllowed = true;
                try {
                    if (!value[nodeProcessedIndicator]) {
                        isWriteAllowed = true;
                        value["[.....write.allowed.....]"] = true;
                        try {
                            delete value["[.....write.allowed.....]"];
                        } catch (deleteError) {
                            value["[.....write.allowed.....]"] = undefined;
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
                    try {
                        JSON.stringify(value);
                        return value;
                    } catch (circRef) {
                        return circRefIndicator;
                    }
                }
            } else {
                return value;
            }
        });
        for (var i = 0; i < _cache.length; i++) {
            if (_cache[i] && _cache[i][nodeProcessedIndicator]) {
                try {
                    delete _cache[i][nodeProcessedIndicator];
                } catch (deleteError) {}
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
        });
    }
};

/* Usage Details: */

var inputObject = {
    /* The input object which may or may not have circular/cyclic references */
};

JSONUtils.getJSON(inputObject);
