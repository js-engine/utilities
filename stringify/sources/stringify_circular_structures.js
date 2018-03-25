var getJSON = function(obj) {
    var str = JSON.stringify(obj, function(key, value) {
        if (typeof value === "object") {
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
        if (typeof value === "object") {
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
var obj = {
    a: 5,
    b: 5,
    sub: {}
};
obj.sub.tmp = obj;
obj.sub.tmp1 = obj;
obj.sub.tmp2 = obj;
obj.sub.tmp3 = obj;
obj.sub.tt = {
    kk: 56,
    subsub: {}
};
obj.sub.tt.subsub.kpt = obj;
obj.sub.tt.subsub.qqf = {};
obj.sub.tt.subsub.qqf.iii = obj.sub.tt;

getJSON(obj);
