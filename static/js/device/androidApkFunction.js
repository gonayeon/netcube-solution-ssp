function androidAgent_getApkVersion() {
    return window.nchandler.getVersion();
}

function androidAgent_getWifiMacAddress() {
    return window.nchandler.getWifiMAC();
}

function androidAgent_getModel() {
    return window.nchandler.getModel();
}

function androidAgent_getBuildName() {
    return window.nchandler.getBuildName();
}

function androidAgent_getSummaryInfo() {
    return window.nchandler.getSummaryInfo();
}

function androidAgent_getNetworkOperatorName() {
    return window.nchandler.getNetworkOperatorName();
}

function androidAgent_deleteProfile(profileName) {
    return window.nchandler.delProfile(profileName);
}

function androidAgent_addProfile(profileName, id, password) {
    return window.nchandler.addProfile(profileName, id, password);
}

function androidAgent_connectProfile(ssid) {
    return window.nchandler.connectProfile(ssid);
}

function androidAgent_finish() {
    return window.nchandler.finish();
}

function androidAgent_isMobileOnActivated() {
    return window.nchandler.isMobileOnActivated();
}