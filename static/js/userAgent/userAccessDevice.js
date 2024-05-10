class UserAccessDevice {
    constructor(userAgentInfo, deviceType, os) {
        this.userAgentInfo = userAgentInfo;
        this.deviceType = deviceType;
        this.os = os;
    }

    getUserAgentInfo() {
        return this.userAgentInfo;
    }
    getDeviceType() {
        return this.deviceType;
    }
    getOs() {
        return this.os;
    }
}

const deviceTypes = {
    "PC" : "P",
    "MOBILE" : "S",
    "OTHERS" : "O"
}

const userAccessDeviceWindows11 = new UserAccessDevice("windows nt 11.0", deviceTypes.PC, osWindows);
const userAccessDeviceWindows10 = new UserAccessDevice("windows nt 10.0", deviceTypes.PC, osWindows);
const userAccessDeviceWindows8 = new UserAccessDevice("windows nt 6.2_windows nt 6.3", deviceTypes.PC, osWindows);
const userAccessDeviceWindows7 = new UserAccessDevice("windows nt 6.1", deviceTypes.PC, osWindows);
const userAccessDeviceWindowsVista = new UserAccessDevice("windows nt 6.0", deviceTypes.PC, osWindows);
const userAccessDeviceWindowsXp = new UserAccessDevice("windows nt 5.1", deviceTypes.PC, osWindows);
const userAccessDeviceWindows2000 = new UserAccessDevice("windows nt 5.0", deviceTypes.PC, osWindows);
const userAccessDeviceWindowsNt = new UserAccessDevice("windows nt 4.0", deviceTypes.PC, osWindows);
const userAccessDeviceWindows98 = new UserAccessDevice("windows 98", deviceTypes.PC, osWindows);
const userAccessDeviceWindows95 = new UserAccessDevice("windows 95", deviceTypes.PC, osWindows);
const userAccessDeviceMacOS = new UserAccessDevice("mac_macintosh", deviceTypes.PC, osMacOS);
const userAccessDeviceLinux = new UserAccessDevice("linux", deviceTypes.PC, osLinux);
const userAccessDeviceIOS = new UserAccessDevice("iphone_ipad", deviceTypes.MOBILE, osIOS);
const userAccessDeviceAndroid = new UserAccessDevice("android", deviceTypes.MOBILE, osAndroid);
const userAccessDeviceOthers = new UserAccessDevice("others", deviceTypes.OTHERS, osOthers);