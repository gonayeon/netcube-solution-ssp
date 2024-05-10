class Os {
    constructor(code, name) {
        this.osCode = code;
        this.osName = name;
    }

    getOsCode() {
        return this.osCode;
    }

    getOsName() {
        return this.osName;
    }
}

const osWindows = new Os("W", "Windows");
const osMacOS = new Os("M", "MacOS");
const osIOS = new Os("I", "iOS");
const osAndroid = new Os("A", "Android");
const osLinux = new Os("L", "Linux");
const osOthers = new Os("O", "Others");