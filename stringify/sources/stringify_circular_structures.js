var getJSON = function(obj) {
    var str = JSON.stringify(obj, function(key, value) {
        if (value && typeof value === "object") {
            if (!value["_[isAlreadyProcessed]_"]) {
                value["_[isAlreadyProcessed]_"] = true;
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
            if (value["_[isAlreadyProcessed]_"]) {
                delete value["_[isAlreadyProcessed]_"];
            }
            return value;
        } else {
            return value;
        }
    });
};

/* Usage / Tests */
getJSON(obj);
