
var editorInitialized = false;
var dataStore = {};

var allowedElements = [
    'H1', 'H2', 'H3', 'SPAN', 'P'
];

var editFormId = 'doqEditElement';
var previewFormId = 'doqPreviewElement';
var highlightClass = 'tooltip_highlight';
var highlightEditClass = 'tooltip_highlight_edit';
var getAnnotationsUrl = 'http://78.47.204.199:8080/doq/getAnnotations';
var saveAnnotationUrl = 'http://78.47.204.199:8080/doq/saveAnnotation';

var previewTooltipVisible = false;
var editTooltipVisible = false;
var editor = null;
var editTooltip = null;
var previewTooltip = null;
var selectedElement = null;
var mouseOverPreview = false;
var mouseOverHighlight = false;
var previewMouseMoveTimeout = 100;
var debug = true;

var getElementId = function (e) {
    return e.innerHTML;
}

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
    post(getAnnotationsUrl, { url: url }, function(d) {
        if (debug) {
            console.log(d);
        }
        callbackSuccess(d);
    }, callbackError);
};

var setBackendAnnotation = function (url, elementIdentifier, annotation, callbackSuccess, callbackError) {
    post(saveAnnotationUrl, { url: url, elementIdentifier: elementIdentifier, annotationData: annotation }, function (d) {
        if (debug) {
            console.log(d);
        }
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
            }
        });
        if (debug) {
            console.log("DOM fully loaded and parsed");
        }

        setTimeout(function() {
            if (!editorInitialized) {
                editorInitialized = true;
                editor = new Jodit('#doqEditElementEditor');
            }
        }, 300);
    });
}

var getAnnotation = function (e) {
    var id = getElementId(e);
    if (dataStore[id]) {
        return dataStore[id];
    }
    return "";
};

var setAnnotation = function (e, annotation, callback) {
    setBackendAnnotation(window.location.href, getElementId(e), annotation, function (data) {
        dataStore[getElementId(e)] = annotation;
        callback();
    });
};

var disposePreviewTooltip = function () {
    if (previewTooltip != null) {
        previewTooltip.destroy();
        previewTooltip = null;
    }
}

var disposeEditTooltip = function () {
    if (editTooltip != null) {
        editTooltip.destroy();
        editTooltip = null;
    }
    unhighlightEdit(selectedElement);
    selectedElement = null;
    editTooltipVisible = false;
    previewTooltipVisible = false;
}

var findAncestor = function (el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}

var isOrInsideTooltip = function (e) {
    return e.classList.contains('tooltip') || findAncestor(e, 'tooltip') != null;
}

function eventShowTooltip(el) {
    mouseOverHighlight = true;
    showAnnotationPreview(el.target);
};

function eventHideTooltip(el) {
    mouseOverHighlight = false;
    if (!editTooltipVisible) { // only works if edit tooltip is not visible
        hideAnnotationPreview(el.target);
    }
}

var highlight = function (e) {
    if (dataStore[getElementId(e)]) {
        if (!e.classList.contains(highlightClass)) {
            e.classList.add(highlightClass);
        }
        e.addEventListener('mouseover', eventShowTooltip);
        e.addEventListener('mouseout', eventHideTooltip);
    }
};

var unhighlight = function (e) {
    if (!dataStore[getElementId(e)]) {
        if (e.classList.contains(highlightClass)) {
            e.classList.remove(highlightClass);
        }
        e.removeEventListener('mouseover', eventShowTooltip);
        e.removeEventListener('mouseout', eventHideTooltip);
    }
};

var addMouseOverPreview = function (e) {
    mouseOverPreview = true;
};

var removeMouseOverPreview = function (e) {
    mouseOverPreview = false;
    hideAnnotationPreview(e);
};

var showAnnotationPreview = function (e) {
    if (!previewTooltipVisible && !editTooltipVisible && dataStore[getElementId(e)]) {
        var pop = document.getElementById(previewFormId);
        pop.classList.remove('hidden');
        pop.querySelector('div.view').innerHTML = getAnnotation(e);
        previewTooltip = new Popper(e, pop);
        previewTooltipVisible = true;
        pop.addEventListener('mouseover', addMouseOverPreview);
        pop.addEventListener('mouseout', removeMouseOverPreview);
    }
};

var hideAnnotationPreview = function (e) {
    setTimeout(function() {
        if (previewTooltipVisible && !mouseOverPreview && !mouseOverHighlight) {
            var pop = document.getElementById(previewFormId);
            pop.classList.add('hidden');
            disposePreviewTooltip();
            previewTooltipVisible = false;
            pop.removeEventListener('mouseover', addMouseOverPreview);
            pop.removeEventListener('mouseout', removeMouseOverPreview);
        }
    }, previewMouseMoveTimeout);
}

var showAnnotationEdit = function (e) {
    if (!editTooltipVisible) {
        var pop = document.getElementById(editFormId);
        pop.classList.remove('hidden');
        editor.setEditorValue(getAnnotation(e));
        editTooltip = new Popper(e, pop);
        mouseOverPreview = false;
        mouseOverHighlight = false;
        hideAnnotationPreview(e);
        editTooltipVisible = true;
        previewTooltipVisible = true;
        hightlightEdit(e);
    }
};

var hightlightEdit = function (e) {
    if (!e.classList.contains(highlightEditClass)) {
        e.classList.add(highlightEditClass);
    }
};

var unhighlightEdit = function (e) {
    if (e.classList.contains(highlightEditClass)) {
        e.classList.remove(highlightEditClass);
    }
};

var saveAnnotation = function () {
    setAnnotation(selectedElement, editor.getEditorValue(), function() {
        highlight(selectedElement);
        disposeEditTooltip();
    });
}

document.addEventListener('dblclick', function (e) {
    selectedElement = e.target;
    highlight(selectedElement);
    showAnnotationEdit(e.target);
});

document.addEventListener('click', function (e) {
    if (editTooltipVisible && !isOrInsideTooltip(e.target)) {
        disposeEditTooltip();
    }
});

init();