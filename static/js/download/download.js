$(document).ready(function() {
    if(checkWindowsProfiler()) {
        setTimeout(function() {
            window.location.href="/";
        }, 1000);
    }
});