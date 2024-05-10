let WLANFUNC = {};

WLANFUNC.port = 43234;
WLANFUNC.offset = 0;
WLANFUNC.version_cache = null;
WLANFUNC.mac_cache = null;
WLANFUNC.wired_mac_cache = null;
WLANFUNC.getmachinename_cache = null;
WLANFUNC.getusername_cache = null;
WLANFUNC.getadjoin_cache = null;
WLANFUNC.getKey_cache = null;

WLANFUNC.getURL = function (path) {
    return "https://127.0.0.1:" + (this.port + this.offset) + path;
}

WLANFUNC.getVersion = function (vers, callback) {
    // validate port.
    // get version & check with vers.
    // vers not match or not connect, return false.
    // it makes install.

    if (this.version_cache != null) {
        if (vers != version_cache) {
            callback(false);
        } else {
            callback(true);
        }

        return;
    }

    let urlConnect = this.getURL("/getversion");
    offset = 0;

    $.ajax({
        url: urlConnect,
        type: "GET",
        crossDomain: true,
        timeout: 5000,
        success:
            function (data) {
                this.version_cache = data;
                (vers !== data) ? callback(false) : callback(true);
            },
        error: function () {
            WLANFUNC.offset++;
            (WLANFUNC.offset > 1) ? callback(false) : WLANFUNC.getVersion(vers, callback);
        }
    });
}

WLANFUNC.getMacAddress = function (callback) {
    let urlConnect = this.getURL("/getmacaddr");

    if (this.mac_cache != null) {
        if (callback != null) {
            callback(this.mac_cache);
        }

        return this.mac_cache;
    }

    $.ajax({
        url: urlConnect,
        type: "GET",
        crossDomain: true,
        timeout: 5000,
        success:
            function (data) {
                if (data != null) {
                    data = data.replace("\\r", "");
                    data = data.replace("\\n", "");
                }

                this.mac_cache = data;

                if (callback != null) {
                    callback(data);
                }
            },
        error: function (data) {
            if (callback != null) {
                callback('');
            }
        }
    });

    if (this.mac_cache != null) {
        return this.mac_cache;
    } else {
        return null;
    }
}

WLANFUNC.getWiredMacAddress = function (callback) {
    let urlConnect = this.getURL("/getwiredmacaddr");

    if (this.wired_mac_cache != null) {
        if (callback != null) {
            callback(this.wired_mac_cache);
        }

        return this.wired_mac_cache;
    }

    $.ajax({
        url: urlConnect,
        type: "GET",
        crossDomain: true,
        timeout: 5000,
        success:
            function (data) {
                if (data != null) {
                    data = data.replace("\\r", "");
                    data = data.replace("\\n", "");
                }

                this.wired_mac_cache = data;

                if (callback != null) {
                    callback(data);
                }
            },
        error: function (data) {
            if (callback != null) {
                callback('');
            }
        }
    });

    if (this.wired_mac_cache != null) {
        return this.wired_mac_cache;
    } else {
        return null;
    }
}

WLANFUNC.deleteProfile = function (profile, callback) {
    let urlConnect = this.getURL("/profile/delete?profile=" + profile);
    if (profile == null || profile == "") {
        callback('0'); // 0 means success.
        return;
    }

    $.ajax({
        url: urlConnect,
        type: "GET",
        crossDomain: true,
        timeout: 5000,
        success:
            function (data) {
                callback(data);
            },
        error: function () {
            callback('');
        }
    });
}

WLANFUNC.createProfile = function (profile, id, pwd, auth, callback) {
    let urlConnect = (auth === true)
                            ? this.getURL("/profile/create?profile=" + profile + "&id=" + id + "&password=" + pwd)
                            : this.getURL("/profile/tlscreate?profile=" + profile + "&id=" + id + "&password=" + pwd);
    $.ajax({
        url: urlConnect,
        type: "GET",
        crossDomain: true,
        timeout: 5000,
        success:
            function (data) {
                callback(data);
            },
        error: function () {
            callback('');
        }
    });
}

WLANFUNC.eCreateProfile = function (data, callback) {
    let urlConnect = this.getURL("/profile/ecreate?" + data);

    $.ajax({
        url: urlConnect,
        type: "GET",
        crossDomain: true,
        timeout: 5000,
        success: function (data) {
            callback(data);
        },
        error: function () {
            callback('');
        }
    });
}

WLANFUNC.createEncryptProfile = function (callback) {
    $.ajax({
        url: "/api/v1/profile/windows-profile",
        type: "GET",
        success: function (response) {
            callback(response.data);
        },
        error: function () {
            callback('fail');
        }
    });
}

WLANFUNC.createWiredProfile = function (classid, callback) {
    let urlConnect = this.getURL("/profile/wiredcreate?auth=tls&classid=" + classid);

    $.ajax({
        url: urlConnect,
        type: "GET",
        crossDomain: true,
        timeout: 5000,
        success:
            function (data) {
                callback(data);
            },
        error: function () {
            callback('');
        }
    });
}

WLANFUNC.connectProfile = function (profile, callback) {
    let urlConnect = this.getURL("/profile/connect?profile=" + profile);

    $.ajax({
        url: urlConnect,
        type: "GET",
        crossDomain: true,
        timeout: 5000,
        success:
            function (data) {
                callback(data);
            },
        error: function () {
            callback('');
        }
    });
}

WLANFUNC.disconnectProfile = function (callback) {
    let urlConnect = this.getURL("/profile/disconnect");

    $.ajax({
        url: urlConnect,
        type: "GET",
        crossDomain: true,
        timeout: 5000,
        success:
            function (data) {
                callback(data);
            },
        error: function () {
            callback('');
        }
    });
};

WLANFUNC.getMachineName = function (callback) {
    let urlConnect = this.getURL("/getmachinename");

    if (this.getmachinename_cache != null) {
        if (callback != null) {
            callback(this.getmachinename_cache);
        }

        return this.getmachinename_cache;
    }

    $.ajax({
        url: urlConnect,
        type: "GET",
        crossDomain: true,
        timeout: 5000,
        success:
            function (data) {
                this.getmachinename_cache = data;
                if (callback != null) {
                    callback(data);
                }
            },
        error: function (data) {
            if (callback != null) {
                callback('');
            }
        }
    });

    if (this.getmachinename_cache != null) {
        return this.getmachinename_cache;
    } else {
        return null;
    }
};

WLANFUNC.getUserName = function (callback) {
    let urlConnect = this.getURL("/getusername");

    if (this.getusername_cache != null) {
        if (callback != null) {
            callback(this.getusername_cache);
        }

        return this.getusername_cache;
    }

    $.ajax({
        url: urlConnect,
        type: "GET",
        crossDomain: true,
        timeout: 5000,
        success:
            function (data) {
                this.getusername_cache = data;
                if (callback != null) {
                    callback(data);
                }
            },
        error: function (data) {
            if (callback != null) {
                callback('');
            }
        }
    });

    if (this.getusername_cache != null) {
        return this.getusername_cache;
    } else {
        return null;
    }
};

WLANFUNC.getAdJoin = function (callback) {
    let urlConnect = this.getURL("/getadjoin");

    if (this.getadjoin_cache != null) {
        if (callback != null) {
            callback(this.getadjoin_cache);
        }

        return this.getadjoin_cache;
    }

    $.ajax({
        url: urlConnect,
        type: "GET",
        crossDomain: true,
        timeout: 5000,
        success:
            function (data) {
                this.getadjoin_cache = data;
                if (callback != null) {
                    callback(data);
                }
            },
        error: function (data) {
            if (callback != null)
                callback('');
        }
    });

    if (this.getadjoin_cache != null) {
        return this.getadjoin_cache;
    } else {
        return null;
    }
};

WLANFUNC.getKey = function (callback) {
    let urlConnect = this.getURL("/getkey_ga");

    if (this.getKey_cache != null) {
        if (callback != null) {
            callback(this.getKey_cache);
        }

        return this.getKey_cache;
    }

    $.ajax({
        url: urlConnect,
        type: "GET",
        crossDomain: true,
        timeout: 5000,
        success:
            function (data) {
                this.getKey_cache = data;
                if (callback != null) {
                    callback(data);
                }
            },
        error: function (data) {
            if (callback != null)
                callback('');
        }
    });

    if (this.getKey_cache != null) {
        return this.getKey_cache;
    } else {
        return null;
    }
};