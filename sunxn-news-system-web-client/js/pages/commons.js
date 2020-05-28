function $(id) {
    return document.getElementById(id);
}
function show(id) {
    $(id).style.display = "block";
}
function hide(id) {
    $(id).style.display = "none";
}
function scroll() {
    if(window.pageYOffset != null) {
        return {
            left: window.pageXOffset,
            top: window.pageYOffset
        }
    }
    else if(document.compatMode === "CSS1Compat") {
        return {
            left: document.documentElement.scrollLeft,
            top: document.documentElement.scrollTop
        }
    }
    return {
        left: document.body.scrollLeft,
        top: document.body.scrollTop
    }
}

const BASE_URL = "http://localhost:10002/api";