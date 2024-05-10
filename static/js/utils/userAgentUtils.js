const DEFAULT_IOS_USER_AGENT = "mozilla/5.0 (iphone; cpu iphone os 17_4_1 like mac os x) applewebkit/605.1.15 (khtml, like gecko) version/17.4.1 mobile/15e148 safari/604.1";

let userAgentString;
let userAccessDevice;
let browser;
let os;
let deviceType;
let userAccessInformation;

function setUserAccessInformation(userAgent) {
    userAccessDevice = findUserAccessDevice(userAgent);
    browser = findBrowserType(userAgent);
    os = userAccessDevice.getOs();
    deviceType = userAccessDevice.getDeviceType();
    userAccessInformation = new UserAccessInformation(userAgent, browser.getBrowserName(), os.getOsCode(), deviceType, $('#callingStationId').val());
}
function findBrowserType(userAgent) {
    if (userAgent.indexOf(browserIE11.getUserAgentInfo()) > -1) {
        return browserIE11;
    } else if (browserIE10.getUserAgentInfo() > -1) {
        return browserIE10;
    } else if (userAgent.indexOf(browserIE9.getUserAgentInfo()) > -1) {
        return browserIE9;
    } else if (userAgent.indexOf(browserIE8.getUserAgentInfo()) > -1) {
        return browserIE8;
    } else if (userAgent.indexOf(browserEdge.getUserAgentInfo().split("_")[0]) > -1 || userAgent.indexOf(browserEdge.getUserAgentInfo().split("_")[1]) > -1) {
        return browserEdge;
    } else if (userAgent.indexOf(browserWhale.getUserAgentInfo()) > -1) {
        return browserWhale;
    } else if (userAgent.indexOf(browserOpera.getUserAgentInfo().split("_")[0]) > -1 || userAgent.indexOf(browserOpera.getUserAgentInfo().split("_")[1]) > -1) {
        return browserOpera;
    } else if (userAgent.indexOf(browserFirefox.getUserAgentInfo()) > -1) {
        return browserFirefox;
    } else if ((userAgent.indexOf(browserChrome.getUserAgentInfo().split("_")[0]) == -1 && userAgent.indexOf(browserChrome.getUserAgentInfo().split("_")[1]) == -1) &&
        (userAgent.indexOf("macintosh") > -1 || userAgent.indexOf("iphone") > -1 || userAgent.indexOf("ipad") > -1) && userAgent.indexOf(browserSafari.getUserAgentInfo()) > -1) {
        return browserSafari;
    } else if (userAgent.indexOf(browserChrome.getUserAgentInfo().split("_")[0]) > -1 || userAgent.indexOf(browserChrome.getUserAgentInfo().split("_")[1]) > -1) {
        return browserChrome;
    } else {
        return browserOthers;
    }
}
function findUserAccessDevice(userAgent) {
    if(userAgent.indexOf(userAccessDeviceWindows11.getUserAgentInfo()) > -1) {
        return userAccessDeviceWindows11;
    } else if (userAgent.indexOf(userAccessDeviceWindows10.getUserAgentInfo()) > -1) {
        return userAccessDeviceWindows10;
    } else if (userAgent.indexOf(userAccessDeviceWindows8.getUserAgentInfo().split("_")[0]) > -1 ||
        userAgent.indexOf(userAccessDeviceWindows8.getUserAgentInfo().split("_")[1]) > -1) {
        return userAccessDeviceWindows8;
    } else if (userAgent.indexOf(userAccessDeviceWindows7.getUserAgentInfo()) > -1) {
        return userAccessDeviceWindows7;
    } else if (userAgent.indexOf(userAccessDeviceWindowsVista.getUserAgentInfo()) > -1) {
        return userAccessDeviceWindowsVista;
    } else if (userAgent.indexOf(userAccessDeviceWindowsXp.getUserAgentInfo()) > -1) {
        return userAccessDeviceWindowsXp;
    } else if (userAgent.indexOf(userAccessDeviceWindows2000.getUserAgentInfo()) > -1) {
        return userAccessDeviceWindows2000;
    } else if (userAgent.indexOf(userAccessDeviceWindowsNt.getUserAgentInfo()) > -1) {
        return userAccessDeviceWindowsNt;
    } else if (userAgent.indexOf(userAccessDeviceWindows98.getUserAgentInfo()) > -1) {
        return userAccessDeviceWindows98;
    } else if (userAgent.indexOf(userAccessDeviceWindows95.getUserAgentInfo()) > -1) {
        return userAccessDeviceWindows95;
    } else if ((userAgent.indexOf(userAccessDeviceMacOS.getUserAgentInfo().split("_")[0]) > -1 && userAgent.indexOf(userAccessDeviceIOS.getUserAgentInfo().split("_")[0]) == -1 && userAgent.indexOf(userAccessDeviceIOS.getUserAgentInfo().split("_")[1]) == -1) || (userAgent.indexOf(userAccessDeviceMacOS.getUserAgentInfo().split("_")[1]) > -1 && userAgent.indexOf(userAccessDeviceIOS.getUserAgentInfo().split("_")[0]) == -1 && userAgent.indexOf(userAccessDeviceIOS.getUserAgentInfo().split("_")[1]) == -1)) {
        return userAccessDeviceMacOS;
    } else if (userAgent.indexOf(userAccessDeviceIOS.getUserAgentInfo().split("_")[0]) > -1 || userAgent.indexOf(userAccessDeviceIOS.getUserAgentInfo().split("_")[1]) > -1) {
        return userAccessDeviceIOS;
    } else if (userAgent.indexOf(userAccessDeviceAndroid.getUserAgentInfo()) > -1) {
        return userAccessDeviceAndroid;
    } else if (userAgent.indexOf(userAccessDeviceLinux.getUserAgentInfo()) > -1) {
        return userAccessDeviceLinux;
    } else {
        return userAccessDeviceOthers;
    }
}
function checkCaptivePortal(userAgent, os) {
    try {
        if(os === osMacOS || os === osIOS) {
            return (userAgent.indexOf('safari') === -1) ? false : true;
        }

        if(os === osAndroid) {
            return (userAgent.indexOf('chrome') != -1 && chrome === undefined) ? false : true;
        }
    } catch (exception) {
        return false;
    }

    return true;
}
function checkAndroidApk() {
    try {
        if(isDevelopMode) {
            return true;
        }
        androidAgent_getWifiMacAddress();
        return true;
    } catch (exception) {
        return false;
    }
}
function checkWindowsProfiler() {
    try {
        if(isDevelopMode) {
            return true;
        }

        WLANFUNC.getVersion('10', function (data) {
            return data;
        });
    } catch (e) {
        return false;
    }
}
function indexNavigator() {
    userAgentString = navigator.userAgent.toLowerCase();
    setUserAccessInformation(userAgentString);

    if(!checkCaptivePortal(userAgentString, os)) {
        switch (os) {
            case osMacOS:
                let redirectOs = (navigator.maxTouchPoints >= 5) ? 'ios' : 'macos';
                location.href = '/captive-portal/'.concat(redirectOs);
                return;

            case osAndroid :
                location.href = '/captive-portal/android';
                return;

            case osIOS :
                location.href = '/captive-portal/ios';
                return;
        }
    }

    if(os === osMacOS && navigator.maxTouchPoints >= 5) {
        userAgentString = DEFAULT_IOS_USER_AGENT;
        setUserAccessInformation(userAgentString);
    }

    if(os === osAndroid && !checkAndroidApk()) {
        location.href = '/download/android-apk';
        return;
    }

    if(os === osWindows && !checkWindowsProfiler()) {
        location.href = '/download/windows-profiler';
        return;
    }

    callApiWithPost("/api/v1/user-access-information", userAccessInformation).then(response => {
        if(response.status === 200) {
            location.href = '/main';
            return;
        }

        if(response.status === 400) {
            location.href = response.data;
            return;
        }
    });
}


function checkProgramInstall() {
    const osCode = userAccessInfo["osCode"];

    if(pageName === "AUTHENTICATE_EMPLOYEE" || pageName === "AUTHENTICATE_VISITOR" || pageName === "MAIN-LANDING" || pageName === "USER_DEVICE") {
        if(osCode === osWindows.getOsCode() && !checkWindowsProfiler()) {
            location.href = '/download/windows-profiler';
            return;
        }

        if(osCode === osAndroid.getOsCode() && !checkAndroidApk()) {
            location.href = '/download/android-apk';
            return;
        }
    }
}