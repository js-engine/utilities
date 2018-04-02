(function() {
    window.computeDim = function() {
        var dimDivElem = document.querySelector("#_dimDivElem_");
        var dimResultDiv = document.querySelector("#_dimResultDiv_");
        if (!dimDivElem || !dimResultDiv) {
            return;
        }
        var result = "";
        result += "<div class=\"treeNode\">Screen Width: <span class=\"treeNodeValue\">" + screen.width + "px</span></div>";
        result += "<div class=\"treeNode\">Screen Height: <span class=\"treeNodeValue\">" + screen.height + "px</span></div>";
        result += "<div class=\"treeNode\">Viewport Width: <span class=\"treeNodeValue\">" + dimDivElem.offsetWidth + "px</span></div>";
        result += "<div class=\"treeNode\">Viewport Height: <span class=\"treeNodeValue\">" + dimDivElem.offsetHeight + "px</span></div>";
        result += "<div class=\"treeNode\">Orientation: <span class=\"treeNodeValue\">" + ((screen.width > screen.height) ? "Landscape" : "Portrait") + "</span></div>";
        result += "<hr/>";
        dimResultDiv.innerHTML = "<div class=\"treeNode\">" + result + "</div>";
    };
    window.knowYourBrowser = function(domcontainer) {
        var dimDiv = document.createElement("div");
        dimDiv.id = "_dimDivElem_";
        dimDiv.style.visibility = "hidden";
        dimDiv.style.zIndex = -99;
        dimDiv.style.position = "absolute";
        dimDiv.style.left = dimDiv.style.top = dimDiv.style.right = dimDiv.style.bottom = "0px";
        document.querySelector("body").appendChild(dimDiv);
        var dimResultDiv = document.createElement("div");
        dimResultDiv.id = "_dimResultDiv_";
        dimResultDiv.classList.add("treeNode");
        (domcontainer || document.querySelector("body")).appendChild(dimResultDiv);
        if (window.attachEvent) {
            window.attachEvent("onresize", computeDim);
        } else {
            window.addEventListener("resize", computeDim, false);
        }
        computeDim();
        var _cache = [];
        var _nodesref = [];
        var traversor = function(obj) {
            if (!obj) {
                return;
            }
            var container;
            if (_nodesref.length > 0) {
                container = _nodesref[_nodesref.length - 1]
            } else {
                container = domcontainer || document.querySelector("body");
            }
            _nodesref.push(container);
            var elem = document.createElement("div");
            elem.className = "treeNode";
            container.appendChild(elem);
            if (!obj["processed_already"]) {
                _nodesref.push(elem);
            }
            var entry;
            var numKeysList = [];
            var keysList = [];
            var rawKeysList = {};
            Object.getOwnPropertyNames(obj).forEach(function(key) {
                rawKeysList[key] = 1;
            });
            for (var key in obj) {
                rawKeysList[key] = 1;
            }
            var _rawKeysList = [];
            for (var key in rawKeysList) {
                _rawKeysList.push(key);
            }
            rawKeysList = _rawKeysList;
            rawKeysList.forEach(function(key) {
                if (isNaN(key)) {
                    keysList.push(key);
                } else {
                    numKeysList.push(key);
                }
            });
            keysList.sort();
            for (var i = 0; i < numKeysList.length; i++) {
                keysList.push(numKeysList[i]);
            }
            var markup;
            var skipKeys = ["mimeTypes", "plugins", "length", "enabledPlugin", "processed_already"];
            for (var i = 0; i < keysList.length; i++) {
                key = keysList[i];
                entry = document.createElement("div");
                entry.className = "treeNode";
                if (obj[key] !== null && obj[key] !== undefined && typeof obj[key] !== "function" && skipKeys.indexOf(key) === -1 && obj[key]["processed_already"] !== true) {
                    if (typeof obj[key] === "object") {
                        entry.innerHTML = "<div class=\"treeNode\">" + key + ":</div>";
                    } else {
                        entry.innerHTML = "<div class=\"treeNode\">" + key + ":" + "<span class=\"treeNodeValue\">" + obj[key] + "</span></div>";
                    }
                    elem.appendChild(entry);
                    if (typeof obj[key] === "object") {
                        traversor(obj[key]);
                        try {
                            obj[key]["processed_already"] = true;
                            _cache.push(obj[key]);
                        } catch (writeErr) {
                            /* Write Error */
                        }
                    }
                }
                if (key === "mimeTypes") {
                    entry.innerHTML = "<div class=\"treeNode\">" + key + ":</div>";
                    var _tmp = {};
                    Object.getOwnPropertyNames(obj["mimeTypes"]).forEach(function(_k) {
                        if (_k && isNaN(_k) && skipKeys.indexOf(_k) === -1) {
                            _tmp[_k] = "1";
                        } else if (_k && !isNaN(_k) && obj["mimeTypes"][_k] && obj["mimeTypes"][_k]["type"]) {
                            _tmp[obj["mimeTypes"][_k]["type"]] = "1";
                        }
                    });
                    for (var _k in _tmp) {
                        entry.innerHTML += "<div class=\"treeNode\"><div class=\"treeNode treeNodeValue\">" + _k + "</div></div>";
                    }
                    elem.appendChild(entry);
                }
                if (key === "plugins") {
                    entry.innerHTML = "<div class=\"treeNode\">" + key + ":</div>";
                    var _tmp = {};
                    Object.getOwnPropertyNames(obj["plugins"]).forEach(function(_k) {
                        if (_k && isNaN(_k) && skipKeys.indexOf(_k) === -1) {
                            _tmp[_k] = "1";
                        } else if (_k && !isNaN(_k) && obj["mimeTypes"][_k] && obj["plugins"][_k]["name"]) {
                            _tmp[obj["plugins"][_k]["name"]] = "1";
                        }
                    });
                    for (var _k in _tmp) {
                        entry.innerHTML += "<div class=\"treeNode\"><div class=\"treeNode treeNodeValue\">" + _k + "</div></div>";
                    }
                    elem.appendChild(entry);
                }
            }
            _nodesref.pop();
        };
        traversor(window.navigator);
        for (var i = 0; i < _cache.length; i++) {
            try {
                delete _cache[i]["processed_already"];
            } catch (deleteErr) {
                /* Delete Error */
            }
        }
        _cache = null;
        var treeNodeElements = document.querySelectorAll(".treeNode");
        for (var i = 0; i < treeNodeElements.length; i++) {
            if (treeNodeElements[i].innerHTML === "") {
                treeNodeElements[i].parentNode.removeChild(treeNodeElements[i]);
            }
        }
    };
}());
