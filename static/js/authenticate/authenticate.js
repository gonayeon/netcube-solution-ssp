$(document).on('blur keyup', `${sectionId} #authenticateForm input`, function() {
    let name = $(this).attr('name');

    if(pageName === "AUTHENTICATE_EMPLOYEE") {
        inputValidation($(this));
    }

    if(pageName === "AUTHENTICATE_VISITOR" && name !== 'password') {
        inputValidation($(this));
    }
});

let x;

function authenticate() {
    if(pageName === "AUTHENTICATE_EMPLOYEE") {
        clearInterval(x);
        // username, password validation
        let username = $(`${sectionId} #authenticateForm input[name="username"]`).val().trim();
        let password = $(`${sectionId} #authenticateForm input[name="password"]`).val().trim();

        if(isEmptyString(username) || isEmptyString(password)) {
            return;
        }
    }

    if(pageName === "AUTHENTICATE_VISITOR") {
        // otp code validation
        let otpCode = $(`${sectionId} #authenticateForm input[name="password"]`).val().trim();

        if(isEmptyString(otpCode)) {
            updateDomTextByDom($(`${sectionId} #error-msg`), javaScriptAuthenticateMessage["VALIDATION_OTP_CODE"]);
            return;
        }
    }

    // request authenticate
    callAuthenticatePost($(`${sectionId} #authenticateForm input`).serialize()).then(response => {
        if(response.status === 200) {
            location.href = '/user-device';
        }

        if(response.status === 400) {
            switch (response.code) {
                // account lock status
                case "A004":
                    updateDomHtmlBySelector(`${sectionId} #error-msg`, javaScriptAuthenticateMessage["ACCOUNT_LOCK_STATUS"].replace("${authenticateFailLockTimeMinute}", authenticateFailLockTimeMinute));
                    startTimer(response.data["accountLockRemainTimeSecond"], '#lockRemainTime');
                    break;

                // otp code is not valid.(visitor only)
                case "A007":
                    clearInterval(x);
                    updateDomHtmlBySelector(`${sectionId} #error-msg`, javaScriptAuthenticateMessage["NOT_VALID_OTP_CODE"]);
                    updateDomClassByDom($(`${sectionId} #authenticateForm #otpCodeInputArea`), true, '!hidden');
                    updateDomAttrByDom($(`${sectionId} #authenticateForm input[name="username"]`), 'readonly', false);
                    updateDomAttrByDom((otpMethod === 'EMAIL') ? $(`${sectionId} #authenticateForm input[name="email"]`) : $(`${sectionId} #authenticateForm input[name="mobile"]`), 'readonly', false);
                    updateDomAttrByDom($(`${sectionId} #authenticateForm #sendOtpCodeButton`), 'disabled', false);
                    updateDomValueByDom($(`${sectionId} #authenticateForm input[name="password"]`), '');
                    updateDomValueByDom($(`${sectionId} #otpTimer`), '');

                    break;

                // not found otp code.(visitor only)
                case "A009":
                    clearInterval(x);
                    updateDomHtmlBySelector(`${sectionId} #error-msg`, javaScriptAuthenticateMessage["OTP_SEND_ERROR"]);
                    updateDomClassByDom($(`${sectionId} #authenticateForm #otpCodeInputArea`), true, '!hidden');
                    updateDomAttrByDom($(`${sectionId} #authenticateForm input[name="username"]`), 'readonly', false);
                    updateDomAttrByDom((otpMethod === 'EMAIL') ? $(`${sectionId} #authenticateForm input[name="email"]`) : $(`${sectionId} #authenticateForm input[name="mobile"]`), 'readonly', false);
                    updateDomAttrByDom($(`${sectionId} #authenticateForm #sendOtpCodeButton`), 'disabled', false);
                    updateDomValueByDom($(`${sectionId} #authenticateForm input[name="password"]`), '');
                    updateDomValueByDom($(`${sectionId} #otpTimer`), '');

                    break;

                // not found user or password not match
                // >> login try count up
                default:
                    let currentAuthenticateFailCount = response.data["authenticateFailCount"];
                    if(currentAuthenticateFailCount < maximumAuthenticateFailCount) {
                        updateDomHtmlBySelector(`${sectionId} #error-msg`, javaScriptAuthenticateMessage["FAIL_DEFAULT"].replace("${currentAuthenticateFailCount}", currentAuthenticateFailCount));
                    }

                    if(currentAuthenticateFailCount >= maximumAuthenticateFailCount) {
                        updateDomHtmlBySelector(`${sectionId} #error-msg`, javaScriptAuthenticateMessage["FAIL_MAX_COUNT"].replace("${maximumAuthenticateFailCount}", maximumAuthenticateFailCount).replace("${authenticateFailLockTimeMinute}", authenticateFailLockTimeMinute));
                    }

                    break;
            }
        }
    });
}
function inputValidation(dom) {
    let value = dom.val();
    let name = dom.attr('name');
    updateInput(name, dom, isEmptyString(value));
    function updateInput(name, dom, is) {
        updateDomClassBySelector(`${sectionId} #message-${name}`, is, 'text-bright-red-800');
        updateDomClassByDom(dom, is, 'border-2 border-bright-red-800');
    }
}
function sendOtpCode() {
    clearInterval(x);
    updateDomTextByDom($(`${sectionId} #error-msg`), "");

    let username = $(`${sectionId} #authenticateForm input[name="username"]`).val().trim();
    let userContactInfo = otpMethod === 'EMAIL' ? $(`${sectionId} #authenticateForm input[name="email"]`).val().trim() : $(`${sectionId} #authenticateForm input[name="mobile"]`).val().trim();
    if(isEmptyString(username) || isEmptyString(userContactInfo)) {
        return;
    }

    if(otpMethod === 'EMAIL' && !checkEmailFrom(userContactInfo)) {
        updateDomClassByDom($(`${sectionId} #authenticateForm input[name="email"]`), true, 'border-2 border-bright-red-800');
        updateDomTextByDom($(`${sectionId} #error-msg`), javaScriptAuthenticateMessage["NOT_VALID_EMAIL_FORM"]);
        return;
    }

    // check visitor status
    let visitorStatusCheckRequestDto = {
        'visitorId' : username,
        'userOtpMethod' : otpMethod,
        'userContactInfo' : userContactInfo
    }

    callApiWithPost("/api/v1/visitors/check-status", visitorStatusCheckRequestDto).then(response => {
        if(response.status === 200) {
            let dto = {
                'userId' : username,
                'userType' : $(`${sectionId} #authenticateForm input[name="userType"]`).val() === "EMPLOYEE" ? "I" : "O",
                'userOtpMethod' : otpMethod,
                'userContactInfo' : userContactInfo
            }

            callApiWithPost("/api/v1/user-otp-code", dto).then(response => {
                if(response.status === 200) {
                    updateDomAttrByDom($(`${sectionId} #authenticateForm input[name="username"]`), 'readonly', true);
                    updateDomAttrByDom((otpMethod === 'EMAIL') ? $(`${sectionId} #authenticateForm input[name="email"]`) : $(`${sectionId} #authenticateForm input[name="mobile"]`), 'readonly', true);
                    updateDomAttrByDom($(`${sectionId} #authenticateForm #sendOtpCodeButton`), 'disabled', true);
                    updateDomClassByDom($(`${sectionId} #authenticateForm #otpCodeInputArea`), false, '!hidden');
                    startTimer(otpCodeValidTime, '#otpTimer', 'OTP');
                }
            });

        }

        if(response.status === 400) {
            switch (response.code) {
                // account lock
                case "A004":
                    updateDomHtmlByDom($(`${sectionId} #error-msg`), javaScriptAuthenticateMessage["ACCOUNT_LOCK_STATUS"].replace("${authenticateFailLockTimeMinute}", authenticateFailLockTimeMinute));
                    startTimer(response.data["accountLockRemainTimeSecond"], '#lockRemainTime', 'LOCK');
                    break;

                // not register visitor
                default:
                    updateDomTextByDom($(`${sectionId} #error-msg`), javaScriptAuthenticateMessage["NOT_REGISTER_VISITOR"]);
                    break;

            }
        }
    });
}
function onInputMobile(target) {
    target.value = target.value
        .replace(/[^0-9]/g, '')
        .replace(/(^02.{0}|^01.{1}|[0-9]{3,4})([0-9]{3,4})([0-9]{4})/g, "$1-$2-$3");
}
function checkEmailFrom(email) {
    let regex=/([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    return (email != '' && email != 'undefined' && regex.test(email));
}
function startTimer(remainTimeSecond, timerSelector, type) {
    let time = remainTimeSecond;
    let min = "";
    let sec = "";

    x = setInterval(function() {
        min = parseInt(time / 60);
        sec = time % 60;
        sec = String(sec).length === 1 ? '0' +sec : sec;

        updateDomTextBySelector(`${sectionId} ${timerSelector}`, min +":" +sec);
        time--;

        if(time < 0) {
            clearInterval(x);

            if(pageName === "AUTHENTICATE_EMPLOYEE") {
                updateDomTextByDom($(`${sectionId} #error-msg`), "");
            }

            if(pageName === "AUTHENTICATE_VISITOR") {
                switch (type) {
                    case "OTP":
                        updateDomClassByDom($(`${sectionId} #authenticateForm #otpCodeInputArea`), true, '!hidden');
                        updateDomAttrByDom($(`${sectionId} #authenticateForm input[name="username"]`), 'readonly', false);
                        updateDomAttrByDom((otpMethod === 'EMAIL') ? $(`${sectionId} #authenticateForm input[name="email"]`) : $(`${sectionId} #authenticateForm input[name="mobile"]`), 'readonly', false);
                        updateDomAttrByDom($(`${sectionId} #authenticateForm #sendOtpCodeButton`), 'disabled', false);
                        updateDomValueByDom($(`${sectionId} #authenticateForm input[name="password"]`), '');
                        updateDomValueByDom($(`${sectionId} #otpTimer`), '');
                        break;

                    case "LOCK":
                        updateDomTextByDom($(`${sectionId} #error-msg`), "");
                        break;

                }
            }
        }
    }, 1000);
}