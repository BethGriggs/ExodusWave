(function () {
    "use strict";
    var versionReq = new XMLHttpRequest(),
        DATAPATH = "/data",
        VERSIONPATH = "/data/_v",
        onload = [],
        data = null,
        complete = false,
        intrface,
        SemVer = function (src) {
            src.replace(/[^\d.]/, "");
            var svparts = src.split(".");

            this.major = parseInt(svparts[0], 10);
            this.minor = parseInt(svparts[1], 10);
            this.patch = parseInt(svparts[2], 10);

            //Negative indicates this is lower version
            //Zero indicates this is same version
            //Positive indicates this is higher version
            this.compareTo = function (other) {
                if (!(other.major && other.minor && other.patch)) {
                    other = new SemVer(other);
                }

                if (this.major > other.major) {
                    return 1;
                } else if (this.major === other.major) {
                    if (this.minor > other.minor) {
                        return 1;
                    } else if (this.minor === other.minor) {
                        if (this.patch > other.patch) {
                            return 1;
                        } else if (this.patch === other.patch) {
                            return 0;
                        } else {
                            return -1;
                        }
                    } else {
                        return -1;
                    }
                } else {
                    return -1;
                }
            };
            return this;
        },
        addNewListener = function (lstn) {
            if (complete) {
                lstn(data);
            } else {
                onload.push(lstn);
            }
        },
        triggerComplete = function(dat) {
            data = dat;
            localStorage.setItem("data", JSON.stringify(data));
            complete = true;
            var i = onload.length;
            while (i--) {
                //Don't want any of that blocking nonsense
                requestAnimationFrame(onload[i].bind(onload[i], data));
            }
        };

    versionReq.responseType = "text";
    versionReq.addEventListener("load", function(e) {
        var download = false,
            localData = JSON.parse(localStorage.getItem("data") || "{}"),
            remoteVersion = new SemVer(e.currentTarget.response),
            localVersion,
            getData = function() {
                var req = new XMLHttpRequest();
                req.responseType = "json";
                req.addEventListener("load", function (e) {
                    triggerComplete(e.currentTarget.response);
                });
                req.open("GET", DATAPATH, true);
                req.send();
                return req;
            },
            dataReq;

        if (localData.hasOwnProperty("_v")) {
            localVersion = new SemVer(localData["_v"]);
            if (remoteVersion.compareTo(localVersion) > 0) {
                getData();
            } else {
                triggerComplete(localData);
            }
        } else {
            getData();
        }

    })


    intrface = {
        init: function() {
            versionReq.open("GET", VERSIONPATH, true);
            versionReq.send();
        },
        listen: addNewListener,
        set onload(e) {
            addNewListener(e);
        },
        get onload() {
            return onload;
        },
        get isComplete() {
            return complete;
        },
        get data() {
            return data;
        }
    }

    window.dataHandler = intrface;
}());
