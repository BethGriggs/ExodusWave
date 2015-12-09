(function() {
    var req = new XMLHttpRequest(),
        DATAPATH = "/data",
        onload = [],
        data = null,
        complete = false,
        interface,
        SemVer = function(src) {
            src.replace(/[^\d.]/, "");
            var svparts = src.split(".");

            this.major = parseInt(svparts[0]);
            this.minor = parseInt(svparts[1]);
            this.patch = parseInt(svparts[2]);

            //Negative indicates this is lower version
            //Zero indicates this is same version
            //Positive indicates this is higher version
            this.compareTo = function(other) {
                if (!(other.major && other.minor && other.patch)) {
                    other = new SemVer(other);
                }

                if (this.major > other.major) {
                    return 1;
                } else if (this.major === other.major) {
                    if(this.minor > other.minor) {
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
        };

    req.onload = function(e) {
        data = e.currentTarget.response;
        complete = true;
        var i = onload.length;
        while(i--) {
            //Don't want any of that blocking nonsense
            requestAnimationFrame(onload[i].bind(onload[i], data));
        }
    };

    req.responseType = "json";

    interface = {
        init: function() {
            req.open("GET", DATAPATH, true);
            req.send();
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

    window.dataHandler = interface;
}());
