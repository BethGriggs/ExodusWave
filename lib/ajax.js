/*jslint plusplus: true*/
/*globals console*/

var debugMode = false;

function debug(toShow) {
    'use strict';
    if (debugMode) {
        console.log(toShow);
    }
}

function ajaxGet(uri, callback) {
    'use strict';
    
    var xhr = new XMLHttpRequest();
    
    function responseHandler() {
        callback(this.responseText);
        debug(this.responseText);
    }
    
    xhr.onload = responseHandler;
    xhr.open("GET", uri, true);
    xhr.send();
}

function ajaxPut(uri, callback, optionsJSON) {
    'use strict';
    
    function responseHandler() {
        callback(this.responseText);
        debug(this.responseText);
    }

    var xhr = new XMLHttpRequest();
    xhr.onload = responseHandler;
    xhr.open("PUT", uri, true);
    xhr.setRequestHeader("Content-type", "application/json");
    
    xhr.send(JSON.stringify(optionsJSON));
}

function ajaxDelete(uri, callback) {
    'use strict';
    
    function responseHandler() {
        callback(this.responseText);
        debug(this.responseText);
    }
    
    var xhr = new XMLHttpRequest();
    xhr.onload = responseHandler;
    xhr.open("DELETE", uri, true);
    xhr.send();
}

function ajaxPost(uri, callback, optionsJSON) {
    'use strict';
    
    var xhr = new XMLHttpRequest();
    
    function responseHandler() {
        callback(this.responseText);
        debug(this.responseText);
    }
    
    xhr.onload = responseHandler;
    xhr.open("POST", uri, true);
    xhr.setRequestHeader("Content-type", "application/json");
    
    xhr.send(JSON.stringify(optionsJSON));
}

function testResponse(response) {
    'use strict';
    console.log(response);
}