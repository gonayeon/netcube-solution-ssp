const sectionId = (userAccessInfo.deviceType === deviceTypes.PC) ? '#pcSection' : '#mobileSection';

$(document).ready(function() {
    setUserDeviceLogDescriptionObject();
    findDeviceInfo();

    if(userAccessInfo.deviceType === deviceTypes.MOBILE) {
        $(`#mobileSection #deviceTypeSelectTab`).children('button').first().click();
    } else {
        renderDeviceList();
    }
})

$(document).on('click', `${sectionId} #deviceList input[type="checkbox"]`, function(){
    if(this.checked) {
        const checkboxes = $(`${sectionId} #deviceList input[type="checkbox"]`);
        for(let ind = 0; ind < checkboxes.length; ind++){
            checkboxes[ind].checked = false;
        }
        this.checked = true;
    } else {
        this.checked = false;
    }

    if($(`${sectionId} #deviceList input[type="checkbox"]:checked`).length === 1) {
        updateDomClassByDom($(`${sectionId} #registerDeviceButton`), true, 'hidden');
        updateDomClassByDom($(`${sectionId} #replaceDeviceButton`), false, 'hidden');
    } else {
        updateDomClassByDom($(`${sectionId} #registerDeviceButton`), false, 'hidden');
        updateDomClassByDom($(`${sectionId} #replaceDeviceButton`), true, 'hidden');
    }
});

const windowProfilerVersion = '10';
let userDeviceLogDescriptionType = {};
let userDevices = {};
let userDeviceFindResponseDtos = [];
let currentDeviceCount= 0;
let permitDeviceCount= 0;
let hostname= "";
let wifiMacAddress = "";

function setUserDeviceObject() {
    if(userDeviceFindResponseDtos.length === 0) {
        return;
    }

    userDeviceFindResponseDtos.forEach(userDeviceFindResponseDto => {
        let seq = userDeviceFindResponseDto["userDeviceSeq"];
        userDevices[seq] = userDeviceFindResponseDto;
    });
}
function findUserDeviceBySeq(seq) {
    return userDevices[seq];
}
function setUserDeviceLogDescriptionObject() {
    for(let i= 0; i < userDeviceLogDescriptions.length; i++) {
        userDeviceLogDescriptionType[userDeviceLogDescriptions[i]] = userDeviceLogDescriptions[i];
    }
}
function findUserDeviceLogDescription(key) {
    return userDeviceLogDescriptionType[key];
}
function findDeviceInfo() {
    switch (userAccessInfo["osCode"]) {
        case osWindows.getOsCode():
            findWindowsDeviceInfo();
            break;

        case osMacOS.getOsCode():
            findMacOsDeviceInfo();
            break;

        case osIOS.getOsCode():
            findIOSDeviceInfo();
            break;

        case osAndroid.getOsCode():
            findAndroidDeviceInfo();
            break;
    }

    updateDomTextBySelector(`${sectionId} #deviceMacAddress`, wifiMacAddress);
}
function findWindowsDeviceInfo() {
    isDevelopMode ? devModeWindowsDeviceInfo() : getWindowsMachineNameCallback();

    function getWindowsMachineNameCallback() {
        try {
            WLANFUNC.getVersion(windowProfilerVersion, function (data) {
                if (data) {
                    WLANFUNC.getMachineName(function (data) {
                        hostname = data;
                        getWindowsWifiMacAddressCallback();
                    });
                } else {
                    // todo :
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    function getWindowsWifiMacAddressCallback() {
        try {
            WLANFUNC.getVersion(windowProfilerVersion, function (data) {
                if(data) {
                    WLANFUNC.getMacAddress(function (data) {
                        wifiMacAddress = data;
                    });
                } else {
                    // todo :
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    function devModeWindowsDeviceInfo() {
        hostname = "WINDOWS_DEVICE";
        wifiMacAddress = "AA-22-33-44-55-CC";
    }
}
function findMacOsDeviceInfo() {
    hostname = "MACOS_DEVICE";
    wifiMacAddress = callingStationId;
}
function findAndroidDeviceInfo() {
    hostname = "ANDROID_DEVICE";
    wifiMacAddress = isDevelopMode ? "13-22-13-13-13-11" : androidAgent_getWifiMacAddress();
}
function findIOSDeviceInfo() {
    hostname = "IOS_DEVICE";
    wifiMacAddress = callingStationId;
}

// [render]
function mobileRenderDeviceList(obj) {
    updateDomAttrByDom($(`#mobileSection #deviceTypeSelectTab`).find('input[type="radio"]'), 'checked', false);
    updateDomAttrByDom($(obj).find('input[type="radio"]'), 'checked', true);
    renderDeviceList();
}
function renderDeviceList() {
    let selectedDeviceType = (userAccessInfo.deviceType === deviceTypes.PC)
        ? $('#pcSection #deviceSelect option:selected').val()
        : $(`#mobileSection #deviceTypeSelectTab input[type="radio"]:checked`).val();

    callApiWithGet(`/api/v1/user-device/${selectedDeviceType}`).then(response => {
        if(response.status === 200) {
            userDeviceFindResponseDtos = response.data["userDeviceFindResponseDtos"];
            setUserDeviceObject();
            currentDeviceCount = response.data["currentDeviceCount"];
            permitDeviceCount = response.data["permitDeviceCount"];
        }
    }).then(() => {
        drawDeviceList();
        updateDomClassByDom($(`${sectionId} #registerDeviceButton`), false, 'hidden');
        updateDomClassByDom($(`${sectionId} #replaceDeviceButton`), true, 'hidden');
    });
}
function drawDeviceList() {
    const listArea = $(`${sectionId} #deviceList`)[0];
    listArea.innerHTML = ``;
    listArea.innerHTML = (userAccessInfo.deviceType === deviceTypes.PC) ? setPcDeviceListDom() : setMobileDeviceListDom();
}
function setPcDeviceListDom() {
    if(userDeviceFindResponseDtos.length === 0) {
        return `<tr><td colspan="6">${javaScriptUserDeviceMessage.NO_LIST_DEVICE}</td></tr>`;
    } else {
        let html = '';
        userDeviceFindResponseDtos.forEach(userDeviceFindResponseDto => {
            html += `<tr>`

            if(ipaIsUsed) {
                html += `<td><input type="checkbox" name="myDevice" class="!appearance-auto" value="${userDeviceFindResponseDto.userDeviceSeq}"></td>`;
            }

            html += `
                <td>${userDeviceFindResponseDto.userDeviceSeq}</td>
                <td>
                    <span class="flex items-center justify-center gap-[6px]">
                        <img src="/images/icon/${userDeviceFindResponseDto.deviceType}-icon.svg" alt="pc icon">
                        ${userDeviceFindResponseDto.deviceNickname}
                    </span>
                </td>
                <td>${userDeviceFindResponseDto.macAddress}</td>
                <td>${userDeviceFindResponseDto.registerDate}</td>
                <td>
                    <button type="button" class="align-middle" onclick="startDeleteDevice(${userDeviceFindResponseDto.userDeviceSeq})">
                        <img src="/images/icon/delete.svg" alt="delete button">
                    </button>
                </td>
            </tr>`;
        });

        return html;
    }
}
function setMobileDeviceListDom() {
    if(userDeviceFindResponseDtos.length === 0) {
        return `<li class="border border-boulder-100 rounded-md p-[4%_3%]">${javaScriptUserDeviceMessage.NO_LIST_DEVICE}</li>`;
    } else {
        let html = "";
        userDeviceFindResponseDtos.forEach(userDeviceFindResponseDto => {
            html += `<li class="border border-boulder-100 rounded-md overflow-hidden flex">`;

            if(ipaIsUsed) {
                html += `
                    <div class="flex justify-center items-center w-[15%]">
                        <input type="checkbox" name="myDevice" class="!appearance-auto" value="${userDeviceFindResponseDto.userDeviceSeq}">
                    </div>
                    
                    <div class="flex justify-center items-center w-[15%]">
                        <img src="/images/icon/${userDeviceFindResponseDto.deviceType}-mockup.png" class="w-1/2 h-auto">
                    </div>
                    
                    <ul class="w-[73%] py-[2%]">
                        <li>${userDeviceFindResponseDto.deviceNickname}</li>
                        <li>MAC Address : <span>${userDeviceFindResponseDto.macAddress}</span></li>
                        <li>${userDeviceFindResponseDto.registerDate}</li>
                    </ul>
                    
                    <button type="button" class="border-l border-boulder-100 w-[12%] flex justify-center items-center" onclick="startDeleteDevice(${userDeviceFindResponseDto.userDeviceSeq})">
                        <img src="/images/icon/delete.svg" class="w-[30%] transition-all-3ms-ease" alt="delete this device">
                    </button>
                </li>`;
            } else {
                html += `
                    <div class="flex justify-center items-center w-[15%]">
                        <img src="/images/icon/${userDeviceFindResponseDto.deviceType}-mockup.png" class="w-1/2 h-auto">
                    </div>
                    
                    <ul class="w-[73%] py-[2%]">
                        <li>${userDeviceFindResponseDto.deviceNickname}</li>
                        <li>MAC Address : <span>${userDeviceFindResponseDto.macAddress}</span></li>
                        <li>${userDeviceFindResponseDto.registerDate}</li>
                    </ul>
                    
                    <button type="button" class="border-l border-boulder-100 w-[12%] flex justify-center items-center" onclick="startDeleteDevice(${userDeviceFindResponseDto.userDeviceSeq})">
                        <img src="/images/icon/delete.svg" class="w-[30%] transition-all-3ms-ease" alt="delete this device">
                    </button>
                </li>`;
            }
        });

        return html;
    }
}


// [delete]
function startDeleteDevice(userDeviceSeq) {
    // todo : confirm modal(two button)
    if (confirm(javaScriptUserDeviceMessage["DELETE_DEVICE_CONFIRM"])) {
        if(ipaIsUsed) {
            ipRelease(userDeviceSeq).then(response => {
                if(response.status === 200) {
                    deleteDevice(userDeviceSeq);
                }
            });
        } else {
            deleteDevice(userDeviceSeq);
        }
    }
}
function deleteDevice(userDeviceSeq){
    deleteDeviceFromAAA(userDeviceSeq).then(response => {
        if(response.status === 200) {
            deleteDeviceFromSSP(userDeviceSeq).then(response => {
                if(response.status === 200) {
                    renderDeviceList();
                }
            });
        }

        // Delete AAA SP error
        if(response.status === 400) {
            // todo : error modal(one button)
            alert(javaScriptUserDeviceMessage[response.data]);
            return;
        }
    });
}
async function ipRelease(userDeviceSeq) {
    let findUserDevice = findUserDeviceBySeq(userDeviceSeq);
    let requestIp = findUserDevice["requestIp"];
    let macAddress = findUserDevice["macAddress"];
    let dhcpIpReleaseRequestDto = {
        'requestIp' : requestIp,
        'macAddress' : macAddress
    }

    const callApiResult = await callApiWithPost("/api/v1/dhcp/ip-release", dhcpIpReleaseRequestDto).then(response => {
        return response;
    });

    return await callApiResult;
}
async function deleteDeviceFromAAA(userDeviceSeq) {
    let findUserDevice = findUserDeviceBySeq(userDeviceSeq);
    let userDeviceDeleteRequestDto = {
        'userDeviceSeq' : userDeviceSeq,
        'userId' : findUserDevice["userId"],
        'macAddress' : findUserDevice["macAddress"],
        'deviceType' : findUserDevice["deviceType"],
        'userType' : findUserDevice["userType"],
        'userDeviceLogDescription' : findUserDeviceLogDescription("LOG_DELETE_DEFAULT")
    }

    const callApiResult = callApiWithDelete("/api/v1/aaa-server", userDeviceDeleteRequestDto).then(response => {
        return response;
    });

    return await callApiResult;
}
async function deleteDeviceFromSSP(userDeviceSeq) {
    let findUserDevice = findUserDeviceBySeq(userDeviceSeq);
    let userDeviceDeleteRequestDto = {
        'userDeviceSeq' : userDeviceSeq,
        'userId' : findUserDevice["userId"],
        'macAddress' : findUserDevice["macAddress"],
        'deviceType' : findUserDevice["deviceType"],
        'userType' : findUserDevice["userType"],
        'userDeviceLogDescription' : findUserDeviceLogDescription("LOG_DELETE_DEFAULT")
    }

    const callApiResult = callApiWithDelete(`/api/v1/user-device`, userDeviceDeleteRequestDto).then(response => {
        return response;
    });

    return await callApiResult;
}


// [save]
function startSaveDevice() {
    // input validation device nickname
    if(isEmptyString($(`${sectionId} #deviceNickname`).val().trim())) {
        // todo : error modal(one button)
        alert(javaScriptUserDeviceMessage["NO_INPUT_DEVICE_NICKNAME"]);
        return;
    }

    // check license status
    checkLicense().then(response => {
        if(response.status === 200) {
            // check UserDevice Register Condition
            checkUserDeviceRegisterCondition().then(response => {
                return response;
            }).then(response => {
                let checkUserDeviceRegisterConditionResultModalMessage = javaScriptUserDeviceMessage[response.data["conditionCheckResult"]];
                if(response.data["result"]) {
                    // todo : confirm modal(two button)
                    if(confirm(checkUserDeviceRegisterConditionResultModalMessage)) {
                        let beforeUserId = response.data["beforeUserId"];
                        let beforeMacAddress = isEmptyString(beforeUserId) ? "" : wifiMacAddress;
                        let userDeviceLogDescription = findUserDeviceLogDescription(isEmptyString(beforeUserId) ? "LOG_SAVE_DEFAULT" : "LOG_SAVE_RE_REGISTER");

                        if(ipaIsUsed) {
                            // ip reserved
                            ipReserved('', beforeUserId, beforeMacAddress).then(response => {
                                if(response.status === 200) {
                                    saveDevice(response.data, wifiMacAddress, beforeUserId, beforeMacAddress, userDeviceLogDescription);
                                }

                                if(response.status === 400) {
                                    // todo : error modal(one button)
                                    alert(javaScriptUserDeviceMessage[response.data]);
                                    return;
                                }
                            });
                        } else {
                            saveDevice(null, wifiMacAddress, beforeUserId, beforeMacAddress, userDeviceLogDescription);
                        }
                    }
                } else {
                    // todo : error modal(one button)
                    alert(checkUserDeviceRegisterConditionResultModalMessage);
                    return;
                }
            })
        }

        if(response.status === 400) {
            // todo : error modal(one button)
            alert(javaScriptUserDeviceMessage[response.data]);
            return;
        }
    });
}
async function checkUserDeviceRegisterCondition() {
    const callApiResult = await callApiWithGet(`/api/v1/user-device/check-register-condition?macAddress=${wifiMacAddress}`).then(response => {
        return response;
    });
    return await callApiResult;
}
async function checkLicense() {
    const callApiResult = await callApiWithPost('/api/v1/aaa-server/check-license').then(response => {
        return response;
    });

    return await callApiResult;
}
async function ipReserved(ipReserved, beforeUserId, beforeMacAddress) {
    let dhcpIpReservedRequestDto = {
        'macAddress' : wifiMacAddress,
        'ipReserved' : ipReserved,
        'beforeUserId' : beforeUserId,
        'beforeMacAddress' : beforeMacAddress
    }

    const callApiResult = await callApiWithPost('/api/v1/dhcp/ip-reserved', dhcpIpReservedRequestDto).then(response => {
        return response;
    });

    return await callApiResult;
}
function saveDevice(dhcpIpReservedResponseDto, macAddress, beforeUserId, beforeMacAddress, userDeviceLogDescription) {
    let deviceNickname = $(`${sectionId} #deviceNickname`).val().trim();
    let bizPlace = "";
    let bizLocation1 = "";
    let bizLocation2 = "";
    let validDateStart = "";
    let validDateEnd = "";
    let dhcpPoolName = ipaIsUsed ? dhcpIpReservedResponseDto["dhcpPoolName"] : "";
    let nap = ipaIsUsed ? dhcpIpReservedResponseDto["nap"] : "";
    let ipReserved = ipaIsUsed ? dhcpIpReservedResponseDto["ipReserved"] : "";
    let userDeviceSaveRequestDto = {
        'macAddress' : macAddress,
        'deviceNickname' : deviceNickname,
        'hostName' : hostname,
        'bizPlace' : bizPlace,
        'bizLocation1' : bizLocation1,
        'bizLocation2' : bizLocation2,
        'validDateStart' : validDateStart,
        'validDateEnd' : validDateEnd,
        'beforeUserId' : beforeUserId,
        'dhcpPoolName' : dhcpPoolName,
        'nap' : nap,
        'ipReserved' : ipReserved,
        'beforeMacAddress' : beforeMacAddress,
        'userDeviceLogDescription' : userDeviceLogDescription
    }

    saveDeviceToAAA(userDeviceSaveRequestDto).then(response => {
        if(response.status === 200) {
            saveDeviceToSSP(userDeviceSaveRequestDto).then(response => {
                if(response.status === 200) {
                    startWifiSetting();
                    renderDeviceList();
                }

                if(response.status === 400) {
                    // todo : error modal(one button)
                    alert(javaScriptUserDeviceMessage[response.data]);
                    return;
                }
            });
        }

        if(response.status === 400) {
            // todo : error modal(one button)
            alert(javaScriptUserDeviceMessage[response.data]);
            return;
        }
    });
}
async function saveDeviceToAAA(userDeviceSaveRequestDto) {
    const callApiResult = await callApiWithPost("/api/v1/aaa-server", userDeviceSaveRequestDto).then(response => {
        return response;
    });

    return await callApiResult;
}
async function saveDeviceToSSP(userDeviceSaveRequestDto) {
    const callApiResult = await callApiWithPost("/api/v1/user-device", userDeviceSaveRequestDto).then(response => {
        return response;
    });

    return await callApiResult;
}


// [replace] >> if ipa used
function startReplaceDevice() {
    if(!ipaIsUsed) {
        return;
    }

    // input validation device nickname
    if(isEmptyString($(`${sectionId} #deviceNickname`).val().trim())) {
        // todo : error modal(one button)
        alert(javaScriptUserDeviceMessage["NO_INPUT_DEVICE_NICKNAME"]);
        return;
    }

    let selectedDeviceId = Number($(`${sectionId} #deviceList input[type="checkbox"]:checked`).val());
    let selectedDevice = findUserDeviceBySeq(selectedDeviceId);

    checkLicense().then(response => {
        if(response.status === 200) {
            let ip = selectedDevice["ipReserved"];
            let beforeUserId = selectedDevice["userId"];
            let beforeMacAddress = selectedDevice["macAddress"];
            let userDeviceLogDescription = findUserDeviceLogDescription("LOG_SAVE_RE_REGISTER_IP_REPLACE");

            // todo : confirm modal(two button)
            if(confirm(javaScriptUserDeviceMessage["REPLACE_DEVICE_CONFIRM"])) {
                ipReserved(ip, beforeUserId, beforeMacAddress).then(response => {
                    if(response.status === 200) {
                        saveDevice(response.data, wifiMacAddress, beforeUserId, beforeMacAddress, userDeviceLogDescription);
                    }

                    if(response.status === 400) {
                        // todo : error modal(one button)
                        alert(javaScriptUserDeviceMessage[response.data]);
                        return;
                    }
                });
            }
        }

        if(response.status === 400) {
            // todo : error modal(one button)
            alert(javaScriptUserDeviceMessage[response.data]);
            return;
        }
    });
}