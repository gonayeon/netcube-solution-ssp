class Browser {
    constructor(userAgentInfo, browserName) {
        this.userAgentInfo = userAgentInfo;
        this.browserName = browserName;
    }

    getUserAgentInfo() {
        return this.userAgentInfo;
    }

    getBrowserName() {
        return this.browserName;
    }
}

const browserIE11 = new Browser("trident/7.0", "IE11");
const browserIE10 = new Browser("msie 10", "IE10");
const browserIE9 = new Browser("msie 9", "IE9");
const browserIE8 = new Browser("msie 8", "IE8");
const browserEdge = new Browser("edge_edg", "Edge");
const browserWhale = new Browser("whale", "Whale");
const browserOpera = new Browser("opera_opr", "Opera");
const browserFirefox = new Browser("firefox", "Firefox");
const browserSafari = new Browser("safari", "Safari");
const browserChrome = new Browser("chrome_crios", "Chrome");
const browserOthers = new Browser("others", "Others");