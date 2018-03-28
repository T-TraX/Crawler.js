var request = require('request');
var dns = require('dns');
var args = process.argv.slice(2);
var paramUrl = args[0];
var regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
if (!paramUrl || !regex.test(paramUrl)) {
    console.error('No valid URL specified');
    return;
}
var getUrlFromRes = function(res, body) {
    var urls = body.match(regex);
    !!urls && urls.forEach(function(url) {
        find_link(url, function() {
            console.log("\x1b[32m", url + ': OK!');
        });
    });
}
var find_link = function(link, callback) {
    var root = '';
    var f = function(link) {
        try {
            request.get(link, function(err, response, body) {
                var res = response;
                if (err) {
                    console.log("\x1b[33m", link + ': ERROR');
                    return;
                }
                if (res.statusCode == 301) {
                    console.log("\x1b[33m", link + ': 301');
                    f(res.headers.location);
                } else if (res.statusCode == 200) {
                    callback(res, body);
                } else {
                    console.log("\x1b[33m", link + ': ' + res.statusCode);
                }
            });
        } catch (e) {
            console.log("\x1b[33m", link + ': ERROR');
        }
    }
    f(link, function(t) {
        i(t, '*')
    });
}
find_link(paramUrl, function(res, body) {
    getUrlFromRes(res, body);
});

function i(data) {
    console.log(require('util').inspect(data, {
        depth: null,
        colors: true
    }))
}