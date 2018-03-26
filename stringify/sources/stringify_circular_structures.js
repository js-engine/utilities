var JSONUtils = {
    "getJSON": function(obj) {
        try {
            return JSON.stringify(obj);
        } catch (circRef) {
            /* circular reference exists, proceed below with additional logic */
        }
        var _cache = [];
        var str = JSON.stringify(obj, function(key, value) {
            if (value && typeof value === "object") {
                if (!value["[.....Node.Processed.....]"]) {
                    value["[.....Node.Processed.....]"] = true;
                    _cache.push(value);
                    return value;
                } else {
                    try {
                        JSON.stringify(value);
                        return value;
                    } catch (circRef) {
                        return "[.....circRef.Key.....]";
                    }
                }
            } else {
                return value;
            }
        });
        for (var i = 0; i < _cache.length; i++) {
            if (_cache[i] && _cache[i]["[.....Node.Processed.....]"]) {
                delete _cache[i]["[.....Node.Processed.....]"];
            }
        }
        var _obj = JSON.parse(str);
        return JSON.stringify(_obj, function(key, value) {
            if (value && typeof value === "object") {
                Object.getOwnPropertyNames(value).forEach(function(k) {
                    if (value[k] === "[.....circRef.Key.....]") {
                        delete value[k];
                    }
                });
                if (value["[.....Node.Processed.....]"]) {
                    delete value["[.....Node.Processed.....]"];
                }
                return value;
            } else {
                return value;
            }
        });
    }
};

/* Usage / Tests */
JSONUtils.getJSON(obj);
