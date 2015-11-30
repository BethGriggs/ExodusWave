(function() {
    var req = new XMLHttpRequest(),
        DATAPATH = "data/data.min.json",
        onload = [],
        data = null,
        complete = false,
        interface,
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
            onload[i](data);
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
