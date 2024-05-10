function updateDomCssBySelector(selector, attr, value) {
    $(`${selector}`).css(attr, value);
}

function updateDomCssByDom(dom, attr, value) {
    dom.css(attr, value);
}

function updateDomAttrBySelector(selector, attr, value) {
    $(`${selector}`).attr(attr, value);
}

function updateDomAttrByDom(dom, attr, value) {
    dom.attr(attr, value);
}

function updateDomPropBySelector(selector, attr, value) {
    $(`${selector}`).prop(attr, value);
}

function updateDomPropByDom(dom, attr, value) {
    dom.prop(attr, value);
}


function updateDomValueBySelector(selector, value) {
    $(`${selector}`).val(value);
}

function updateDomValueByDom(dom, value) {
    dom.val(value);
}
function updateDomClassByDom(dom, is, value) {
    is ? dom.addClass(value) : dom.removeClass(value);
}
function updateDomClassBySelector(selector, is, value) {
    is ? $(`${selector}`).addClass(value) : $(`${selector}`).removeClass(value);
}

function updateDomTextByDom(dom, value) {
    dom.text(value);
}
function updateDomTextBySelector(selector, value) {
    $(`${selector}`).text(value);
}

function updateDomHtmlByDom(dom, value) {
    dom.html(value);
}
function updateDomHtmlBySelector(selector, value) {
    $(`${selector}`).html(value);
}
