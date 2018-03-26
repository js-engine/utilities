var JSONUtils = {
    "getJSON": function(obj) {
        var _cache = {};
        var str = JSON.stringify(obj, function(key, value) {
            if (value && typeof value === "object") {
                if (!_cache[value]) {
                    _cache[value] = "[.....Node.Processed.....]";
                    return value;
                } else {
                    return "[.....circRef.Key.....]";
                }
            } else {
                return value;
            }
        });
        var _obj = JSON.parse(str);
        return JSON.stringify(_obj, function(key, value) {
            if (value && typeof value === "object") {
                Object.getOwnPropertyNames(value).forEach(function(k) {
                    if (value[k] === "[.....circRef.Key.....]") {
                        delete value[k];
                    }
                });
                return value;
            } else {
                return value;
            }
        });
    }
};

/* Usage / Tests */
JSONUtils.getJSON(obj);
