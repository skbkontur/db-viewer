/* eslint-disable */
var loaderUtils = require("loader-utils");
var parseString = require("xml2js").parseString;

module.exports = function(source) {
    this.cacheable && this.cacheable();
    this.value = source;
    var cb = this.async();
    var query = loaderUtils.parseQuery(this.query);
    query.mode = query.mode || (query.short && "ShortText") || "Text";
    parseString(source, function(err, result) {
        var resultObject = {};
        var rootElement = result.XmlReference || result.root;
        for (var i = 0; i < rootElement.ReferenceItem.length; i++) {
            var item = rootElement.ReferenceItem[i];
            resultObject[item.Code[0].toString()] = getTextByLang(item, query.lang || "", query.mode);
        }
        if (err) {
            cb(err);
        } else {
            cb(null, "module.exports = " + JSON.stringify(resultObject));
        }
    });
};

function stri(i) {
    return JSON.stringify(i, undefined, "  ");
}

function getTextByLang(item, lang, mode) {
    var data;

    for (var i = 0; i < item.Description.length; i++) {
        if (item.Description[i].Language[0] === lang) {
            data = item.Description[i];
        }
    }

    if (data === undefined) {
        data = item.Description[0][mode][0];
    }

    if (mode === "Cases") {
        return getCases(data);
    }

    return data[mode];
}

function getCases(data) {
    if (data.Cases === undefined) {
        return { one: data.Text[0], few: data.Text[0], many: data.Text[0] };
    }

    return data.Cases[0].Accusative[0].Form.reduce(function(mem, form) {
        switch (form.AfterNumeral[0]) {
            case "1":
                mem.one = form.Text[0];
                break;
            case "2":
                mem.few = form.Text[0];
                break;
            case "0":
                mem.many = form.Text[0];
                break;
        }
        return mem;
    }, {});
}
