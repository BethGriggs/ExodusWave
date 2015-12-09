/*jslint node:true regexp: true nomen: true*/
// Everything in one file...may god save us all
"use strict";
var path = require("path"),
    fs = require("fs"),
    http = require("http"),
    forceKill = false,
    server,
    preLoad,
    postLoad,
    data,
    utils = (function () {
        var prop,
            encode = {
                core: function (option, text) {
                    return this.codes[option] + text + "\x1B[0m";
                },
                codes: {
                    black: "\x1B[30m",
                    red: "\x1B[31m",
                    green: "\x1B[32m",
                    yellow: "\x1B[33m",
                    blue: "\x1B[34m",
                    magenta: "\x1B[35m",
                    cyan: "\x1B[36m",
                    white: "\x1B[37m",
                    bold: "\x1B[1m"
                }
            },
            mime = {
                type: {
                    'html': 'text/html',
                    'js': 'application/javascript',
                    'css': 'text/css',
                    'json': 'application/json',
                    'png': 'image/png',
                    'jpeg': 'image/jpeg',
                    'gif': 'image/gif',
                    'bmp': 'image/bmp',
                    'txt': 'text/plain',
                    'svg': 'image/svg+xml',
                    'svgz': 'image/svg+xml'
                },
                find: function (path) {
                    // Regex matches everything before the final dot,
                    // plus the final dot itself
                    return mime.type[path.replace(/^.*(?=\.)\./, '')];
                }
            };

        for (prop in encode.codes) {
            if (encode.codes.hasOwnProperty(prop)) {
                encode[prop] = encode.core.bind(encode, prop);
            }
        }

        return {
            ansi: encode,
            mime: mime,
            getDeepVal: function (path, object) {
                if (path.length === 1) {
                    return object[path[0]] || null;
                } else {
                    if (object.hasOwnProperty(path[0])) {
//                        path.shift();
                        return this.getDeepVal(path, object[path.shift()]);
                    } else {
                        return null;
                    }
                }
            }
        };
    }());

preLoad = function (callback) {
    fs.readFile(path.join(__dirname, "data", "data.min.json"), function (err, file) {
        if (err) { // Hard error, no recovery from this
            console.log(err);
            process.exit();
        } else {
            data = JSON.parse(file.toString());
            callback();
        }
    });
};
postLoad = function () {
    server = http.createServer(function (req, res) {
        var stream,
            fullpath,
            stat,
            match,
            property;

        if (req.url === "/") {
            req.url = "/index.html"; // Lazy hack so that index is handled like a file
        }
        if (req.url.charAt(req.url.length - 1) === "/") {
            req.url = req.url.substring(0, req.url.length - 1); // Strip rogue slash
        }

        fullpath = path.join(__dirname, req.url);

        // First check if the request was proxied,
        // then if any of the other variables are
        // set depending on the connection type
        req.ip = req.headers['x-forwarded-for'] ||
                 req.connection.remoteAddress ||
                 req.socket.remoteAddress ||
                 req.connection.socket.remoteAddress;

        try {
            if (fs.existsSync(fullpath) && (stat = fs.statSync(fullpath)).isFile()) {
                stream = fs.createReadStream(fullpath, {encoding: 'utf8'});
                stream.on('end', function () {
                    res.end();
                });
                res.writeHead(200, {
                    'Content-Type': utils.mime.find(fullpath)
                });
                stream.pipe(res);
            } else {
                if (req.url === "/data") {
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    });
                    res.end(JSON.stringify(data));
                } else if ((match = /\/data\/([a-zA-Z0-9\/\_\-]+)/.exec(req.url)) !== null) {
                    property = utils.getDeepVal(match[1].split("/"), data);
                    if (property !== null) {
                        if (typeof property === 'object') {
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify(property));
                        } else {
                            res.writeHead(200, {'Content-Type': 'text/plain'});
                            res.end(property.toString());
                        }
                    } else {
                        res.end(JSON.stringify({'code': 404, 'message': "Property " + req.url + " not found"}));
                    }
                } else {
                    res.writeHead(404, {
                        'Content-Type': 'application/json'
                    });
                    res.end(JSON.stringify({'code': 404, 'message': "Path " + req.url + " not found"}));
                }
            }
        } catch (e) {
            console.error(e);
            res.writeHead(500, {
                'Content-Type': 'application/json'
            });

            if (process.env.NODE_ENV === "production") {
                res.end(JSON.stringify({'code': 500, 'message': "Error Accessing Requested Resource"}));
            } else {
                res.end(JSON.stringify({'code': 500, 'message': e}));
            }
        }

        res.on("finish", function () {
            var col = utils.ansi.green; // OK
            if (res.statusCode >= 300) { // Redirect
                col = utils.ansi.blue;
            }
            if (res.statusCode >= 400) { // Bad Request
                col = utils.ansi.yellow;
            }
            if (res.statusCode >= 500) { // Server Error
                col = utils.ansi.red;
            }

            console.log(utils.ansi.cyan(req.ip), req.method, (col(res.statusCode)), req.url);
        });
    });
    server.on("close", function () {
        // Cleanup
    });
    server.listen(8080);

    process.on("SIGINT", function () {
        if (!forceKill) {
            forceKill = true;
            console.log(utils.ansi.magenta("\nClosing Exodus Wave Server"));
            server.close();
            // Other cleanup
            process.exit();
        } else {
            process.exit();
        }
    });
};

preLoad(postLoad);
