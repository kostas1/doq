


var editorInitialized = false;
var dataStore = {};

var allowedElements = [
    'H1', 'H2', 'H3', 'SPAN', 'P'
];

var formId = 'popperElement';
var getAnnotationsUrl = 'http://78.47.204.199:8080/doq/getAnnotations';
var saveAnnotationUrl = 'http://78.47.204.199:8080/doq/saveAnnotation';

var allowPreview = true;
var editor = null;
var tooltip = null;
var previewTooltip = null;
var selectedElement = null;

var get = function (url, callbackSuccess, callbackError) {
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == XMLHttpRequest.DONE) {
            callbackSuccess(JSON.parse(xhttp.responseText));
        } else {
            if (callbackError) {
                callbackError(xhttp.responseText);
            } else {
                console.log(xhttp.responseText);
            }
        }
    };
}

var post = function (url, obj, callbackSuccess, callbackError) {
    var xhttp = new XMLHttpRequest();
    xhttp.open('POST', url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == XMLHttpRequest.DONE) {
            callbackSuccess(JSON.parse(xhttp.responseText));
        } else {
            if (callbackError) {
                callbackError(xhttp.responseText);
            } else {
                console.log(xhttp.responseText);
            }
        }
    };
    xhttp.send(JSON.stringify(obj));
}

var getBackendAnnotations = function (url, callbackSuccess, callbackError) {
    var data = {};
    post(getAnnotationsUrl, { url: url }, function(d) {
        data = d;
        data['Join GitHub today'] = 'omg it works';
        console.log(d);
        callbackSuccess(data);
    }, callbackError);
};

var setBackendAnnotation = function (url, elementIdentifier, annotation, callbackSuccess, callbackError) {
    post(saveAnnotationUrl, { url: url, elementIdentifier: elementIdentifier, annotationData: annotation }, function (d) {
        console.log(d);
        callbackSuccess(d);
    }, callbackError);
};

var init = function() {
    getBackendAnnotations(window.location.href, function (data) {
        dataStore = data;
        var elements = document.body.querySelectorAll(allowedElements.join(","));
        elements.forEach(function (element) {
            if (!element.children || element.children.length == 0) {
                highlight(element);
                // console.log(element.innerHTML);
            }
        });
        console.log("DOM fully loaded and parsed");
    });
}

document.addEventListener("DOMContentLoaded", function (event) {
    init();
});

var getAnnotation = function (e) {
    if (dataStore[e.innerHTML]) {
        return dataStore[e.innerHTML];
    }
    return "";
};

var setAnnotation = function (e, annotation, callback) {
    setBackendAnnotation(window.location.href, e.innerHTML, annotation, function (data) {
        dataStore[e.innerHTML] = annotation;
        callback();
    });
};

var dispose = function () {
    if (tooltip != null) {
        tooltip.destroy();
        tooltip = null;
    }
    if (selectedElement != null) {
        unhighlight(selectedElement);
        selectedElement = null;
    }
    document.getElementById(formId).classList.add('hidden');
}

var findAncestor = function (el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}

var isOrInsideTooltip = function (e) {
    return e.classList.contains('tooltip') || findAncestor(e, 'tooltip') != null;
}

var hideTooltip = function (e) {
    if (!e || !isOrInsideTooltip(e)) {
        allowPreview = true;
        dispose();
    }
};

var showTooltip = function (e) {
    allowPreview = false;
    hideAnnotationPreview(e.target);
    if (!isOrInsideTooltip(e)) {
        if (allowedElements.includes(e.tagName)) {
            selectedElement = e;
            highlight(selectedElement, true);
            var pop = document.getElementById(formId);
            pop.classList.remove('hidden');
            pop.querySelector('div.annotationEdit').classList.remove('hidden');
            tooltip = new Popper(selectedElement, pop);
            editAnnotation();
        }
    }
}

document.addEventListener('click', function (e) {
    hideTooltip(e.target);
});

function eventShowTooltip(el) {
    showAnnotationPreview(el.target);
};

function eventHideTooltip(el) {
    hideAnnotationPreview(el.target);
}

var highlight = function (e, force) {
    if (force) {
        if (!e.classList.contains('tooltip_highlight')) {
            e.classList.add('tooltip_highlight');
        };
    }
    if (dataStore[e.innerHTML]) {
        if (!e.classList.contains('tooltip_highlight')) {
            e.classList.add('tooltip_highlight');
        };
        e.addEventListener('mouseover', eventShowTooltip);
        e.addEventListener('mouseout', eventHideTooltip);
    }
};

var unhighlight = function (e) {
    if (e.classList.contains('tooltip_highlight')) {
        if (!dataStore[e.innerHTML]) {
            e.classList.remove('tooltip_highlight');
            e.removeEventListener('mouseover', eventShowTooltip);
            e.removeEventListener('mouseout', eventHideTooltip);
        }
    }
};

var showAnnotationPreview = function (e) {
    if (allowPreview && dataStore[e.innerHTML]) {
        var pop = document.getElementById('popperPreview');
        pop.classList.remove('hidden');
        pop.querySelector('div.view').innerHTML = getAnnotation(e);
        previewTooltip = new Popper(e, pop);
    }
};

var hideAnnotationPreview = function (e) {
    var pop = document.getElementById('popperPreview');
    pop.classList.add('hidden');
    if (previewTooltip) {
        previewTooltip.destroy();
    }
}

document.addEventListener('dblclick', function (e) {
    showTooltip(e.target);
});

var editAnnotation = function () {
    var pop = document.getElementById(formId);
    pop.querySelector('div.annotationEdit').classList.remove('hidden');
    if (!editorInitialized) {
        editorInitialized = true;
        editor = new Jodit('#editor');
    }
    editor.setEditorValue(getAnnotation(selectedElement));
}
var saveAnnotation = function () {
    setAnnotation(selectedElement, editor.getEditorValue(), function() {
        highlight(selectedElement);
        hideTooltip();
    });
}

init();