
var domain = 'http://78.47.204.199:8080/doq';
domain = 'http://localhost:8080/';


var popperLink = document.createElement('link');
popperLink.id = 'poppercss';
popperLink.rel = 'stylesheet';
popperLink.href = domain + 'popper.css';
document.head.appendChild(popperLink);

var editorLink = document.createElement('link');
editorLink.id = 'joditcss';
editorLink.rel = 'stylesheet';
editorLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/jodit/3.0.4/jodit.min.css';
document.head.appendChild(editorLink);

var script = document.createElement('script');
script.src = 'https://unpkg.com/popper.js/dist/umd/popper.min.js';
document.getElementsByTagName('head')[0].appendChild(script);

script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jodit/3.0.37/jodit.min.js';
document.getElementsByTagName('head')[0].appendChild(script);

script = document.createElement('script');
script.src = domain + 'script.js';
document.getElementsByTagName('head')[0].appendChild(script);


document.body.innerHTML += `
<div class="tooltip hidden" role="tooltip" id="popperPreview">
    <div class="tooltip-arrow">

    </div>
    <div class="tooltip-inner">
        <div class="view">

        </div>
    </div>
</div>

<div class="tooltip hidden" role="tooltip" id="popperElement">
    <div class="tooltip-arrow">

    </div>
    <div class="tooltip-inner">
        <div class="annotationView">
            <button onclick="editAnnotation()">Edit annotation</button>
        </div>
        <div class="annotationEdit hidden">
            <button onclick="saveAnnotation()">Save changes</button>
            <hr/>
            <textarea id="editor" name="editor">

                </textarea>
        </div>
    </div>
</div>
`;