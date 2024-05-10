function startWifiSetting() {
    // todo : loading modal

    switch (userAccessInfo["osCode"]) {
        case osWindows.getOsCode():
            startWindowsWifiSetting();
            break;

        case osMacOS.getOsCode():
            startAppleWifiSetting();
            break;

        case osAndroid.getOsCode():
            startAndroidWifiSetting();
            break;

        case osIOS.getOsCode():
            startAppleWifiSetting();
            break;

    }
}
function startWindowsWifiSetting() {
    getWindowsProfileKey();
}
function startAppleWifiSetting() {
    callApiWithPost("/api/v1/profile/apple-profile").then(response => {
        if(response.status === 200) {
            // todo : apple guide modal on(mac or ios)

            setTimeout(() => {
                location.href = `/api/v1/profile/apple-profile/${response.data}`;
            }, 1000)
        }

        if(response.status === 400) {
            // todo : error modal(one button)
            alert(javaScriptUserDeviceMessage[response.data]);
        }
    });
}
function startAndroidWifiSetting() {
    if(!isDevelopMode) {
        callApiWithGet("/api/v1/profile/android-info").then(response => {
            if(response.status === 200) {
                const userId = response.data["userId"];
                const password = response.data["password"];
                const profileName = response.data["profileName"];
                const guestProfileName = response.data["guestProfileName"];

                androidAgent_deleteProfile(guestProfileName);
                androidAgent_deleteProfile(profileName);

                if(androidAgent_addProfile(profileName, userId, password)) {
                    androidAgent_connectProfile(profileName);
                    androidAgent_finish();
                }
            }

            if(response.status === 400) {
                // todo : error modal(one button)
                alert(javaScriptUserDeviceMessage[response.data]);
            }
        });
    }
}
function getWindowsProfileKey() {
    if(!isDevelopMode) {
        WLANFUNC.getKey(function (data) {
            createWindowsEncryptProfile(data);
        });
    } else {
        // todo : success modal(one button)
        alert(javaScriptUserDeviceMessage["SUCCESS_WIFI_SETTING_WINDOWS"]);
    }
}
function createWindowsEncryptProfile(keyData) {
    callApiWithPostWithJsonBody("/api/v1/profile/windows-profile", keyData).then(response => {
        if(response.status === 200) {
            const guestProfileName = response.data["guestProfileName"];
            const profileName = response.data["profileName"];
            const encryptProfile = response.data["encryptProfile"];
            connectWindowsProfile(guestProfileName, profileName, encryptProfile);
        }
    });
}
function connectWindowsProfile(guestProfileName, profileName, encryptProfile) {
    WLANFUNC.deleteProfile(guestProfileName, function () {
        WLANFUNC.deleteProfile(profileName, function () {
            WLANFUNC.disconnectProfile(function (){
                WLANFUNC.eCreateProfile(encryptProfile, function (data) {
                    WLANFUNC.connectProfile(profileName, function(data) {
                        // todo : success modal(one button)
                        alert(javaScriptUserDeviceMessage["SUCCESS_WIFI_SETTING_WINDOWS"]);
                    });
                });
            });
        });
    });
}