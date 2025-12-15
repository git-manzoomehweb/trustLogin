var ownerEl = document.querySelector(".main-login-container");
var culture = ownerEl.dataset.culture
var agencySignup = ownerEl.dataset.agencySignup
var loginForm = ownerEl.querySelector(".loginForm");
var loginFormMessage = ownerEl.querySelector(".api-message");
var countryCode = ownerEl.querySelector(".country-code");
var token;
var hashid;
var hasCaptcha = false;
var dmntoken = 0;
var tellCode = "+98";
const captchaContainer = document.createElement("div");
captchaContainer.classList.add("captchaContainer");
captchaContainer.setAttribute("id", "captchaContainer")
const itemTemp = document.createElement("div");
itemTemp.classList.add("item_wrapper");
const itemTempContainer = document.createElement("div");
itemTempContainer.classList.add("item_wrapper");
const itemField = document.createElement("div");
itemTempContainer.appendChild(itemField);
const itemIconTemp = document.createElement("span");
itemIconTemp.classList.add("itemIcon");
const itemInputTemp = document.createElement("input");
itemInputTemp.setAttribute("type", "text");
itemInputTemp.classList.add("itemInput");
itemInputTemp.classList.add("itemInputBox");
const itemInputTemp2 = document.createElement("input");
itemInputTemp2.setAttribute("type", "text");
itemInputTemp2.classList.add("itemInput");
itemTemp.appendChild(itemIconTemp);
itemTemp.appendChild(itemInputTemp);
itemField.appendChild(itemInputTemp2);
let username = "";
// ALa web service
const ala_json = [{
    name: "Destino",
    ownerid: 9630,
    code: "+968"
}, {
    name: "wanderlux",
    ownerid: 9657,
    code: "+971"
}, {
    name: "tatev",
    ownerid: 9427,
    code: "+374"
}, {
    name: "Ticketzone",
    ownerid: 9705,
    code: "+971"
}];

const ownerIdValue = parseInt(document.querySelector(".company-ownerid").value);
const matchedCompany = ala_json.find(element => element.ownerid === ownerIdValue);
const defaultInputValue = "";

if (matchedCompany) {
    document.querySelector("#firstUsernameInput").setAttribute("placeholder", `${culture === 'fa'
        ? 'ایمیل یا شماره موبایل'
        : culture === 'ar'
            ? 'رقم الجوال أو البريد الالكتروني '
            : 'Mobile number or email'
        }`);
} else {
    document.querySelector("#firstUsernameInput").setAttribute("placeholder", `${culture === 'fa'
        ? 'ایمیل یا شماره موبایل'
        : culture === 'ar'
            ? 'البريد الالكتروني'
            : 'Email'
        }`);
}
function getToken() {
    // Set the data source for "db.runLogin" and enable it (true)

    $bc.setSource("db.runLogin", true);
    // Find the element with the class ".action-loading" and remove the "hidden" class
    // This likely makes a loading indicator visible
    document.querySelector(".action-loading").classList.remove("hidden");
}


function setDmnToken() {
    // Get the value from the input element with the id "dmntoken"
    const thisdmntoken = convertToEnglishNumbers(document.querySelector("#dmntoken").value);
    // Set the global or higher-scoped variable 'dmntoken' to the retrieved value
    dmntoken = thisdmntoken;
    // Set the data source for "db.runTokenCommand", passing an object with the value true 
    // and the current dmntoken (probably for some authentication or token validation purpose)
    $bc.setSource("db.runTokenCommand", {
        value: true,
        dmntoken: thisdmntoken,
    });
}
function resendSMS(e, mode) {
    // Remove the input field for 'code' by finding its closest parent element with the class "item_wrapper"
    loginForm
        .querySelector("input[name='code']")
        .closest(".item_wrapper")
        .remove();

    // Check the mode and update the form name accordingly
    if (mode == 1) {
        checkUsername();
        // Set the form's name to "form.authentication" for authentication mode
        loginForm.setAttribute("name", "form.authentication");
    } else if (mode == 2) {
        // Set the form's name to "form.selectuser" for user selection mode
        loginForm.setAttribute("name", "form.selectuser");
    }

    // Trigger a click event on the submit button (class "login-btn") to resend the SMS
    loginForm.querySelector(".login-btn").click();

    // Make the countdown container visible by removing the "hidden" class
    loginForm.querySelector("#countDownContainer").classList.remove("hidden");

    // Disable the "resendSMS" button to prevent multiple resends:
    // - Remove the "onclick" attribute so it can't be clicked again
    loginForm.querySelector(".resendSMS").removeAttribute("onclick");
    // - Add the "disabled" class to indicate the button is disabled
    loginForm.querySelector(".resendSMS").classList.add("disabled");
}
function refreshAuthenticationCaptcha(e) {
    // Set the source for the CAPTCHA token to refresh the CAPTCHA by calling 
    // "token.recaptcha" with the value true, likely triggering a new CAPTCHA challenge
    $bc.setSource("token.recaptcha", true);
}

function forgetPassword(e) {
    // Find the input field with the name 'code', if it exists, 
    // and remove its closest parent element with the class 'item_wrapper'
    loginForm
        .querySelector("input[name='code']")
        ?.closest(".item_wrapper")
        .remove();

    // Find the input field with the name 'captchaid', if it exists,
    // and remove its closest parent element with the class 'item_wrapper'
    loginForm
        .querySelector("input[name='captchaid']")
        ?.closest(".item_wrapper")
        .remove();

    // Set the form's name attribute to "form.forgetpassword" to indicate 
    // that the user is performing a password reset
    loginForm.setAttribute("name", "form.forgetpassword");

    // Trigger a click on the login button to submit the form
    loginForm.querySelector(".login-btn").click();

    // Remove the forget password container element to possibly hide or clean up the UI
    loginForm.querySelector("#forgetPasswordContainer").remove();
}
function selectUserForForgetPass(e) {
    // Set the value of the input field with the name 'user' in the loginForm
    // to the value of the 'data-user' attribute from the element 'e'
    loginForm.querySelector("input[name='user']").value =
        e.getAttribute("data-user");
}
function turnBack() {
    checkUsername();
    // Set the form's name attribute to "form.authentication", likely switching back to login mode
    loginForm.setAttribute("name", "form.authentication");

    // Show all elements with the ID 'firstUsername' by removing the 'hidden' class
    const firstUsername = loginForm?.querySelectorAll("#firstUsername");
    firstUsername?.forEach((e) => {
        e.classList.remove("hidden");
        e.querySelector("#firstUsernameInput").value = '';
    });

    // Remove all elements with the ID 'emailListContainer', likely clearing the email list display
    const emailListContainer = loginForm?.querySelectorAll("#emailListContainer");
    emailListContainer?.forEach((e) => {
        e.remove();
    });

    // Show all elements with the ID 'showCaptcha' by removing the 'hidden' class to display CAPTCHA
    const showCaptcha = ownerEl?.querySelectorAll("#showCaptcha");
    showCaptcha?.forEach((e) => {
        e.classList.remove("hidden");
    });

    // Remove all elements with the ID 'usernameBoxID', likely clearing any username input fields
    const usernameBoxID = loginForm?.querySelectorAll("#usernameBoxID");
    usernameBoxID?.forEach((e) => {
        e.remove();
    });

    // Remove all elements with the ID 'captchaContainer', clearing the CAPTCHA display
    const captchaContainer = loginForm?.querySelectorAll("#captchaContainer");
    captchaContainer?.forEach((e) => {
        e.remove();
    });

    // Remove all elements with the class 'item_wrapper', likely clearing certain UI components
    const itemWrappers = loginForm?.querySelectorAll(".item_wrapper");
    itemWrappers?.forEach((e) => {
        e.remove();
    });

    // Remove all elements with the ID 'mailsSelectContainer', likely clearing the mail selection UI
    const mailsSelectContainer = loginForm?.querySelectorAll("#mailsSelectContainer");
    mailsSelectContainer?.forEach((e) => {
        e.remove();
    });

    // Remove all elements with the ID 'newUserFormContainer', likely clearing any new user forms
    const newUserFormContainer = loginForm?.querySelectorAll("#newUserFormContainer");
    newUserFormContainer?.forEach((e) => {
        e.remove();
    });

    // For all elements with the ID 'countDownContainer', remove the countdown timer if it exists
    const countDownContainer = loginForm?.querySelectorAll("#countDownContainer");
    countDownContainer?.forEach((e) => {
        e.querySelector(".countDown") ? e.querySelector(".countDown").remove() : '';
    });

    // For all elements with the ID 'countDownContainer', remove the countdown timer if it exists
    const selectUserTitle = ownerEl?.querySelectorAll("#selectUser-title");
    selectUserTitle?.forEach((e) => {
        e.classList.add("hidden");
    });

}
function showLoginContainer() {

    // Check if the element with the class 'user-entrance-body' is hidden, and if so, make it visible
    document.querySelector(".user-entrance-body").style.display = "block";
    // Check if the element with the class 'login-section-container' exists
    if (document.querySelector(".login-section-container")) {
        // If the login section is hidden, make it visible
        if (document.querySelector(".login-section-container").classList.contains("hidden")) {
            document.querySelector(".login-section-container").classList.remove("hidden");
        }
    }
    const btn = event.target.closest('.btnstyle');
    const input = document.getElementById('firstUsernameInput');

}
function closeLoginContainer(element) {
    // Toggle the class 'hidden' on the closest parent element with the class 'user-entrance-body'
    element.closest(".user-entrance-body").style.display = "none";
}

async function onProcessedToken(args) {
    checkUsername();
    loginFormMessage.innerHTML = "";
    document.querySelector("#showCaptcha").removeAttribute("onclick");
    const response = args.response;
    const responseJson = await response.json();
    const errorid = responseJson.errorid;
    const captcha = responseJson.Captcha;
    const captchaId = responseJson.Captcha_id;
    token = responseJson.token;
    document.querySelector(".action-loading").classList.add("hidden");
    if (errorid == '1') {
        // dmntoken expired
        loginFormMessage.innerHTML = `<span class="error">${culture === 'fa'
            ? 'توکن ارسال شده نامعتبر است'
            : culture === 'ar'
                ? 'الرمز المُرسل غير صالح'
                : 'The token sent is invalid'
            }</span>`;
        l
        setTimeout(function () {
            // loginFormMessage.innerHTML = "";
            if (loginFormMessage.querySelector(".error")) {
                loginFormMessage.querySelector(".error").remove();
            }

        }, 3000);
    } else if (errorid == '3') {
        // remaintime - less than 60 seconds
        loginFormMessage.innerHTML = `<span class="error"> 
            ${culture === 'fa'
                ? `از زمان اعتبار کلید قبلی ${responseJson.remain_time} ثانیه باقی مانده است`
                : culture === 'ar'
                    ? `تبقى ${responseJson.remain_time} ثانية من صلاحية المفتاح السابق`
                    : `There is ${responseJson.remain_time} second left from the validity of the previous key`
            }
          </span>`;

        setTimeout(function () {
            // loginFormMessage.innerHTML = "";
            if (loginFormMessage.querySelector(".error")) {
                loginFormMessage.querySelector(".error").remove();
            }
        }, 3000);
    } else if (errorid == "9") {
        loginForm.appendChild(captchaContainer)

        if (token) {

            $bc.setSource("token.token", token);
            $bc.setSource("authentication.token", token);
            ownerEl.querySelector(".getToken")?.remove();
            const itemWrappers = loginForm?.querySelectorAll(".item_wrapper");
            itemWrappers?.forEach((e) => {
                e.remove();
            });


            loginForm?.setAttribute("name", "form.authentication");
            if (username != undefined && username != "") {
                document
                    .querySelector(".itemInput")
                    .setAttribute("value", username);
            }


            if (captcha == true) {
                const itemTempCopyForCaptcha = itemTemp.cloneNode(true);
                itemTempCopyForCaptcha.setAttribute("id", "captchaChild")
                itemTempCopyForCaptcha.querySelector(
                    ".itemIcon"
                ).innerHTML = `<img src="/${captchaId}" />`;
                itemTempCopyForCaptcha
                    .querySelector(".itemInput")
                    .setAttribute("name", "captchaid");
                itemTempCopyForCaptcha
                    .querySelector(".itemInput")
                    .setAttribute("id", "captchaCode");
                hasCaptcha = true;
                const tempRefresh = document.createElement("div");
                tempRefresh.classList.add("refreshCaptcha");
                tempRefresh.setAttribute("onclick", "refreshAuthenticationCaptcha(this)");
                tempRefresh.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 46 46" fill="none">
 <rect width="45" height="45" rx="5" fill="#D5DDE3"/>
 <path d="M28.64 18.35C27.19 16.9 25.2 16 22.99 16C18.57 16 15 19.58 15 24C15 28.42 18.57 32 22.99 32C26.72 32 29.83 29.45 30.72 26H28.64C27.82 28.33 25.6 30 22.99 30C19.68 30 16.99 27.31 16.99 24C16.99 20.69 19.68 18 22.99 18C24.65 18 26.13 18.69 27.21 19.78L23.99 23H30.99V16L28.64 18.35Z" fill="#004B85"/>
 </svg>`;
                itemTempCopyForCaptcha.appendChild(tempRefresh);
                itemTempCopyForCaptcha
                    .querySelector(".itemInput")
                    .addEventListener("keyup", function (inputKeyUp) {
                        if (this.value.length == 4) {
                            loginForm.querySelector(".login-btn").click();
                        }
                    });
                captchaContainer.appendChild(itemTempCopyForCaptcha)
                captchaContainer.classList.remove("hidden");

            }

            const itemTempCopyForSubmitBtn = itemTemp.cloneNode(true);
            itemTempCopyForSubmitBtn.innerHTML = `
            <div class="resend-countdown-wrapper">
                <div class="resendSMS disabled"></div>
                <div id="countDownContainer"></div>
            </div>
            <div id="forgetPasswordContainer"></div>
            <button type="submit" class="login-btn background-color_1 bg-primary" onclick="checkUsername()">
                  ${culture === 'fa'
                    ? 'مرحله بعدی'
                    : culture === 'ar'
                        ? 'التالي'
                        : 'Next'
                }
                </button>
              `;

            loginForm.appendChild(itemTempCopyForSubmitBtn);
            if (captcha == false) {
                loginForm.querySelector(".login-btn").click();
            }

            document.querySelector("#showCaptcha").classList.add("hidden");

        } else {
            loginFormMessage.innerHTML = `<span class="error">${culture === 'fa'
                ? 'خطا در انجام عملیات'
                : culture === 'ar'
                    ? 'خطأ في العملية'
                    : 'Error in operation'
                }</span>`;

            setTimeout(function () {
                if (loginFormMessage.querySelector(".error")) {
                    loginFormMessage.querySelector(".error").remove();
                }
            }, 3000);
        }
    } else if (errorid == "10") {
        loginFormMessage.innerHTML = `<span class="error">${culture === 'fa'
            ? 'خطا در انجام عملیات'
            : culture === 'ar'
                ? 'خطأ في العملية'
                : 'Error in operation'
            }</span>`;
        setTimeout(function () {
            setTimeout(function () {
                if (loginFormMessage.querySelector(".error")) {
                    loginFormMessage.querySelector(".error").remove();
                }
            }, 3000);

        }, 3000);
    }

}
async function onProcessedAuthentication(args) {
    const response = args.response;
    const responseJson = await response.json();
    const errorid = responseJson.errorid;
    if (errorid == "1") {
        // token is expired
        loginFormMessage.innerHTML = `<span class="error">${culture === 'fa'
            ? 'توکن ارسال شده نامعتبر است'
            : culture === 'ar'
                ? 'الرمز المُرسل غير صالح'
                : 'The token sent is invalid'
            }</span>`;


        setTimeout(function () {
            if (loginFormMessage.querySelector(".error")) {
                loginFormMessage.querySelector(".error").remove();
            }
        }, 3000);
    } else if (errorid == "2") {
        let type = responseJson.type;
        let newUser = responseJson.newUser;
        if (type == "mobile") {
            if (newUser == true) {
                // ------------------------- new changes -------------------------
                document.querySelector("#usernameBoxID") ? document.querySelector("#usernameBoxID").remove() : '';
                firstUsernameInputValue = document.querySelector("#firstUsernameInput").value
                firstUsernameContainer = document.querySelector("#firstUsernameContainer")
                usernameBox = document.createElement("div")
                usernameBox.setAttribute("id", "usernameBoxID")
                usernameSpan = document.createElement("span")
                usernameBox.appendChild(usernameSpan)
                usernameSpan.innerHTML = firstUsernameInputValue
                firstUsernameContainer.appendChild(usernameBox)
                usernameBox.classList.add("usernameBox")
                usernameBox.innerHTML += `
                    <div class="userBoxLeftSide">
                      <span class="newUser">${culture === 'fa'
                        ? 'کاربر جدید'
                        : culture === 'ar'
                            ? 'مستخدم جديد'
                            : 'new user'
                    }</span>
                      <svg width="6" height="12" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.32539 0.953389C5.53505 1.1331 5.55933 1.44875 5.37962 1.65841L1.65853 5.99968L5.37962 10.341C5.55933 10.5506 5.53505 10.8663 5.32539 11.046C5.11572 11.2257 4.80007 11.2014 4.62036 10.9917L0.620363 6.32508C0.459867 6.13783 0.459867 5.86153 0.620363 5.67429L4.62036 1.00762C4.80007 0.797958 5.11572 0.773678 5.32539 0.953389Z" fill="#1C274C"/>
                      </svg>
                    </div>
                  `;

                usernameBox.setAttribute("onclick", "turnBack()")
                document.querySelector("#login-title").classList.add("hidden")
                document.querySelector("#firstUsername").classList.add("hidden")
                document.querySelector("#captchaContainer").classList.add("hidden")

                // newmobile
                loginFormMessage.innerHTML = `<span class="success">
                    ${culture === 'fa'
                        ? 'کد احراز هویت از طریق پیامک ارسال شد (کاربر جدید)'
                        : culture === 'ar'
                            ? 'تم إرسال رمز التحقق عبر الرسائل القصيرة (مستخدم جديد)'
                            : 'The authentication code was sent via SMS (new user)'
                    }
                  </span>`;


                setTimeout(function () {
                    if (loginFormMessage.querySelector(".success")) {
                        loginFormMessage.querySelector(".success").remove();
                    }
                }, 3000);
                loginForm.setAttribute("name", "form.login");
                hashid = responseJson.hashid;
                $bc.setSource("authentication.hashid", hashid);

                const itemTempCopyForCode = itemTempContainer.cloneNode(true);
                itemTempCopyForCode
                    .querySelector(".itemInput")
                    .setAttribute("name", "code");
                itemTempCopyForCode
                    .querySelector(".itemInput").focus();
                itemTempCopyForCode
                    .querySelector(".itemInput")
                    .setAttribute("placeholder", `${culture === 'fa'
                        ? 'کد ارسال شده را وارد کنید...'
                        : culture === 'ar'
                            ? 'أدخل الرمز...'
                            : 'Enter the code...'
                        }`);

                loginForm.lastChild.before(itemTempCopyForCode)
                const resendSMS = loginForm.querySelector(".resendSMS");
                resendSMS.innerHTML = `<div class="codeContainerRe">
                    <span id="resendCodeSMS">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 0 0-2.134 0l-1.022.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V8.844a2.25 2.25 0 0 1 1.183-1.981l7.5-4.039a2.25 2.25 0 0 1 2.134 0l7.5 4.039a2.25 2.25 0 0 1 1.183 1.98V19.5Z" />
                      </svg>
                    </span>
                    <span class="resendCodeText">${culture === 'fa'
                        ? 'ارسال مجدد کد...'
                        : culture === 'ar'
                            ? 'إعادة إرسال الرمز'
                            : 'Resend the code'
                    }</span>
                  </div>`;


                resendCodeSMSVar = document.querySelector("#resendCodeSMS")
                if (resendCodeSMSVar) {
                    resendCodeSMSVar.classList.remove("hidden")

                }
                countDownContainer = document.querySelector("#countDownContainer")
                const countDownText = document.createElement("div")
                countDownText.classList.add("countDown")
                countDownContainer.appendChild(countDownText)
                let seconds = 60;
                let countDown = setInterval(function () {
                    seconds--;
                    seconds = seconds.toLocaleString(undefined, {
                        minimumIntegerDigits: 2,
                    });

                    countDownText.textContent = ` 00 : ${seconds} `;
                    if (seconds < 1) {
                        clearInterval(countDown);
                        resendSMS.classList.remove("disabled");
                        resendSMS.setAttribute("onclick", "resendSMS(this, 1)");
                        countDownContainer.querySelector(".countDown") ? countDownContainer.querySelector(".countDown").remove() : '';
                        countDownContainer.classList.add("hidden")
                    }
                }, 1000);
            } else {
                // authentication by mobile – single user
                // ----------------new ------------------
                document.querySelector("#usernameBoxID") ? document.querySelector("#usernameBoxID").remove() : '';
                firstUsernameInputValue = document.querySelector("#firstUsernameInput").value
                firstUsernameContainer = document.querySelector("#firstUsernameContainer")
                usernameBox = document.createElement("div")
                usernameBox.setAttribute("id", "usernameBoxID")
                usernameSpan = document.createElement("span")
                usernameBox.appendChild(usernameSpan)
                usernameSpan.innerHTML = firstUsernameInputValue
                firstUsernameContainer.appendChild(usernameBox)
                usernameBox.classList.add("usernameBox")
                usernameBox.innerHTML += `
 <div class="userBoxLeftSide">
 <svg width="6" height="12" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path fill-rule="evenodd" clip-rule="evenodd" d="M5.32539 0.953389C5.53505 1.1331 5.55933 1.44875 5.37962 1.65841L1.65853 5.99968L5.37962 10.341C5.55933 10.5506 5.53505 10.8663 5.32539 11.046C5.11572 11.2257 4.80007 11.2014 4.62036 10.9917L0.620363 6.32508C0.459867 6.13783 0.459867 5.86153 0.620363 5.67429L4.62036 1.00762C4.80007 0.797958 5.11572 0.773678 5.32539 0.953389Z" fill="#1C274C"/>
 </svg>
 </div>
 `
                usernameBox.setAttribute("onclick", "turnBack()")
                document.querySelector("#firstUsernameContainer").classList.remove('hidden')
                document.querySelector("#firstUsername").classList.add("hidden")
                document.querySelector("#captchaContainer").classList.add("hidden")
                const userNo = document.createElement("div")
                const mailsSelectContainer = document.createElement("div")
                mailsSelectContainer.appendChild(userNo)
                loginForm.lastChild.before(mailsSelectContainer);
                userNo.setAttribute("id", "userNoID")
                mailsSelectContainer.setAttribute("id", "mailsSelectContainer")
                userNo.classList.remove("hidden")
                loginFormMessage.innerHTML = `<span class="success">${culture === 'fa'
                    ? 'کد احراز هویت از طریق پیامک ارسال شد'
                    : culture === 'ar'
                        ? 'تم إرسال رمز التحقق عبر الرسائل القصيرة'
                        : 'The authentication code was sent via SMS'
                    }</span>`;
                setTimeout(function () {
                    if (loginFormMessage.querySelector(".success")) {
                        loginFormMessage.querySelector(".success").remove();
                    }
                }, 3000);
                loginForm.setAttribute("name", "form.login");
                hashid = responseJson.hashid;
                $bc.setSource("authentication.hashid", hashid);
                const itemTempCopyForCode = itemTempContainer.cloneNode(true);
                itemTempCopyForCode
                    .querySelector(".itemInput")
                    .setAttribute("name", "code");
                itemTempCopyForCode
                    .querySelector(".itemInput").focus();
                itemTempCopyForCode
                    .querySelector(".itemInput")
                    .setAttribute("placeholder", `${culture === 'fa'
                        ? 'کد ارسال شده را وارد کنید...'
                        : culture === 'ar'
                            ? 'أدخل الرمز...'
                            : 'Enter the code...'
                        }`);

                userNo.appendChild(itemTempCopyForCode)

                const resendSMS = loginForm.querySelector(".resendSMS");
                resendSMS.innerHTML = `<div class="codeContainerRe">
                    <span id="resendCodeSMS">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 0 0-2.134 0l-1.022.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V8.844a2.25 2.25 0 0 1 1.183-1.981l7.5-4.039a2.25 2.25 0 0 1 2.134 0l7.5 4.039a2.25 2.25 0 0 1 1.183 1.98V19.5Z" />
                      </svg>
                    </span>
                    <span class="resendCodeText">${culture === 'fa'
                        ? 'ارسال مجدد کد...'
                        : culture === 'ar'
                            ? 'إعادة إرسال الرمز...'
                            : 'Resend the code'
                    }</span>
                  </div>`;

                countDownContainer = document.querySelector("#countDownContainer")
                const countDownText = document.createElement("div")
                countDownText.classList.add("countDown")
                countDownContainer.appendChild(countDownText)
                let seconds = 60;
                let countDown = setInterval(function () {
                    seconds--;
                    seconds = seconds.toLocaleString(undefined, {
                        minimumIntegerDigits: 2,
                    });

                    countDownText.textContent = ` 00 : ${seconds} `;
                    if (seconds < 1) {
                        clearInterval(countDown);
                        resendSMS.classList.remove("disabled");
                        resendSMS.setAttribute("onclick", "resendSMS(this, 1)");
                        countDownContainer.querySelector(".countDown") ? countDownContainer.querySelector(".countDown").remove() : '';
                        countDownContainer.classList.add("hidden")
                    }
                }, 1000);

            }
        } else if (type == "username" || type == "email") {
            if (newUser == true) {
                firstUsernameInputValue = document.querySelector("#firstUsernameInput").value
                firstUsernameContainer = document.querySelector("#firstUsernameContainer")
                usernameBox = document.createElement("div")
                usernameBox.setAttribute("id", "usernameBoxID")
                usernameSpan = document.createElement("span")
                usernameSpan.classList.add("newUserSpanName")
                usernameBox.appendChild(usernameSpan)
                usernameSpan.innerHTML = firstUsernameInputValue
                firstUsernameContainer.appendChild(usernameBox)
                usernameBox.classList.add("usernameBox")
                usernameBox.innerHTML += `
                    <div class="userBoxLeftSide">
                      <span class="newUser">${culture === 'fa'
                        ? 'کاربر جدید'
                        : culture === 'ar'
                            ? 'مستخدم جديد'
                            : 'new user'
                    }</span>
                      <svg width="6" height="12" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.32539 0.953389C5.53505 1.1331 5.55933 1.44875 5.37962 1.65841L1.65853 5.99968L5.37962 10.341C5.55933 10.5506 5.53505 10.8663 5.32539 11.046C5.11572 11.2257 4.80007 11.2014 4.62036 10.9917L0.620363 6.32508C0.459867 6.13783 0.459867 5.86153 0.620363 5.67429L4.62036 1.00762C4.80007 0.797958 5.11572 0.773678 5.32539 0.953389Z" fill="#1C274C"/>
                      </svg>
                    </div>
                  `;

                usernameBox.setAttribute("onclick", "turnBack()")
                document.querySelector("#login-title").classList.add("hidden")
                document.querySelector("#firstUsername").classList.add("hidden")
                const newUserFormContainer = document.createElement("div")
                newUserFormContainer.setAttribute("id", "newUserFormContainer")
                loginForm.lastChild.before(newUserFormContainer);
                newUserFormContainer.classList.remove("hidden")
                document.querySelector("#captchaContainer").classList.add("hidden")
                // newusername
                loginForm.setAttribute("name", "form.login");
                hashid = responseJson.hashid;

                $bc.setSource("authentication.hashid", hashid);

                // password
                const itemTempCopyForCode = itemTempContainer.cloneNode(true);

                itemTempCopyForCode
                    .querySelector(".itemInput")
                    .setAttribute("name", "code");
                itemTempCopyForCode
                    .querySelector(".itemInput")
                    .setAttribute("type", "password");
                itemTempCopyForCode
                    .querySelector(".itemInput")
                    .setAttribute("placeholder", `${culture === 'fa'
                        ? 'لطفا رمز عبور خود را وارد کنید...'
                        : culture === 'ar'
                            ? 'يرجى إدخال كلمة المرور الخاصة بك...'
                            : 'Please enter your password...'
                        }`);

                newUserFormContainer.appendChild(itemTempCopyForCode);

                // repeatpassword
                const itemTempCopyForReCode = itemTempContainer.cloneNode(true);

                itemTempCopyForReCode
                    .querySelector(".itemInput")
                    .setAttribute("name", "recode");
                itemTempCopyForReCode
                    .querySelector(".itemInput")
                    .setAttribute("type", "password");
                itemTempCopyForReCode
                    .querySelector(".itemInput")
                    .setAttribute("placeholder", `${culture === 'fa'
                        ? 'رمز عبور را تکرار کنید...'
                        : culture === 'ar'
                            ? 'يرجى إعادة إدخال كلمة المرور...'
                            : 'Please enter your password again...'
                        }`);

                newUserFormContainer.appendChild(itemTempCopyForReCode);


                if (type == "username") {
                    // email
                    const itemTempCopyForEmail = itemTempContainer.cloneNode(true);
                    itemTempCopyForEmail
                        .querySelector(".itemInput")
                        .setAttribute("name", "email");
                    itemTempCopyForEmail
                        .querySelector(".itemInput")
                        .setAttribute("required", true);
                    itemTempCopyForEmail
                        .querySelector(".itemInput")
                        .setAttribute("placeholder", `${culture === 'fa'
                            ? 'لطفا ایمیل خود را وارد کنید...'
                            : culture === 'ar'
                                ? 'يرجى إدخال بريدك الإلكتروني...'
                                : 'Please enter your email...'
                            }`);

                    newUserFormContainer.appendChild(itemTempCopyForEmail);
                }


                // mibile
                const itemTempCopyForMobile = itemTempContainer.cloneNode(true);
                if (culture == 'fa') {

                    itemTempCopyForMobile
                        .querySelector(".itemInput")
                        .setAttribute("name", "mobile");
                    itemTempCopyForMobile
                        .querySelector(".itemInput")
                        .setAttribute(
                            "placeholder",
                            `${culture === 'fa'
                                ? 'لطفا شماره موبایل خود را وارد کنید...'
                                : culture === 'ar'
                                    ? 'يرجى إدخال رقم الهاتف المحمول الخاص بك...'
                                    : 'Please enter your mobile number...'
                            }`
                        );

                } else {

                    itemTempCopyForMobile
                        .querySelector(".itemInput")
                        .setAttribute("name", "mobile");
                    itemTempCopyForMobile
                        .querySelector(".itemInput")
                        .setAttribute(
                            "placeholder",
                            `${culture === 'fa'
                                ? 'لطفا شماره موبایل خود را وارد کنید...'
                                : culture === 'ar'
                                    ? 'يرجى إدخال رقم الهاتف المحمول الخاص بك...'
                                    : 'Please enter your mobile number...'
                            }`
                        );

                    itemTempCopyForMobile
                        .querySelector(".itemInput").classList.add("hidden")
                }

                newUserFormContainer.appendChild(itemTempCopyForMobile);


            } else {
                // --------------new design----------------------
                firstUsernameInputValue = document.querySelector("#firstUsernameInput").value
                firstUsernameContainer = document.querySelector("#firstUsernameContainer")
                usernameBox = document.createElement("div")
                usernameBox.setAttribute("id", "usernameBoxID")
                usernameSpan = document.createElement("span")
                usernameBox.appendChild(usernameSpan)
                usernameSpan.innerHTML = firstUsernameInputValue
                firstUsernameContainer.appendChild(usernameBox)
                usernameBox.classList.add("usernameBox")
                usernameBox.innerHTML += `
 <div class="userBoxLeftSide">
 <svg width="6" height="12" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path fill-rule="evenodd" clip-rule="evenodd" d="M5.32539 0.953389C5.53505 1.1331 5.55933 1.44875 5.37962 1.65841L1.65853 5.99968L5.37962 10.341C5.55933 10.5506 5.53505 10.8663 5.32539 11.046C5.11572 11.2257 4.80007 11.2014 4.62036 10.9917L0.620363 6.32508C0.459867 6.13783 0.459867 5.86153 0.620363 5.67429L4.62036 1.00762C4.80007 0.797958 5.11572 0.773678 5.32539 0.953389Z" fill="#1C274C"/>
 </svg>
 </div>
 `
                usernameBox.setAttribute("onclick", "turnBack()")
                document.querySelector("#login-title").classList.add("hidden")
                document.querySelector("#firstUsername").classList.add("hidden")
                document.querySelector("#captchaContainer").classList.add("hidden")
                // -------------------------------------------------------

                // authentication by username
                loginForm.setAttribute("name", "form.login");
                hashid = responseJson.hashid;
                $bc.setSource("authentication.hashid", hashid);
                const itemTempCopyForCode = itemTempContainer.cloneNode(true);
                itemTempCopyForCode.setAttribute("id", "enterpasswordField")
                itemTempCopyForCode
                    .querySelector(".itemInput")
                    .setAttribute("name", "code");
                itemTempCopyForCode
                    .querySelector(".itemInput")
                    .setAttribute("type", "password");
                itemTempCopyForCode
                    .querySelector(".itemInput")
                    .setAttribute("placeholder", `${culture === 'fa'
                        ? 'رمز عبور (حساس به حروف کوچک و بزرگ)'
                        : culture === 'ar'
                            ? 'يرجى إدخال كلمة المرور (حساسة لحالة الأحرف)'
                            : 'Please enter your password (case sensitive)'
                        }`);

                // ---new changes ------------------
                itemTempCopyForCode
                    .querySelector(".itemInput")
                    .setAttribute("id", "enterpassword");


                ///////////////////////////////////////////////add new
                //                 const inputEl = itemTempCopyForCode.querySelector(".itemInput");

                //                 const toggleBtn = document.createElement("button");
                //                 toggleBtn.type = "button";
                //                 toggleBtn.innerHTML = `
                //     <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                //          viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                //          class="w-5 h-5">
                //         <path stroke-linecap="round" stroke-linejoin="round"
                //               d="M2.036 12.322a1.012 1.012 0 010-.639
                //                  C3.423 7.51 7.36 4.5 12 4.5
                //                  c4.64 0 8.577 3.01 9.964 7.183
                //                  .07.207.07.431 0 .639
                //                  C20.577 16.49 16.64 19.5 12 19.5
                //                  c-4.64 0-8.577-3.01-9.964-7.178z" />
                //         <path stroke-linecap="round" stroke-linejoin="round"
                //               d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                //     </svg>
                // `;
                //                 toggleBtn.style.position = "absolute";
                //                 toggleBtn.style.right = "8px";
                //                 toggleBtn.style.top = "50%";
                //                 toggleBtn.style.transform = "translateY(-50%)";
                //                 toggleBtn.style.background = "none";
                //                 toggleBtn.style.border = "none";
                //                 toggleBtn.style.cursor = "pointer";
                //                 toggleBtn.style.padding = "0";
                //                 toggleBtn.style.display = "none";


                //                 inputEl.insertAdjacentElement("afterend", toggleBtn);


                //                 toggleBtn.addEventListener("click", () => {
                //                     if (inputEl.type === "password") {
                //                         inputEl.type = "text";
                //                     } else {
                //                         inputEl.type = "password";
                //                     }
                //                 });

                ///////////////////////////////////////////////

                const forgetPassword = loginForm.querySelector("#forgetPasswordContainer");
                forgetPassword.innerHTML = `<div class="codeContainerReForget">
                    <span id="resendCodeSMS">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                      </svg>
                    </span>
                    <span class="resendCodeText">${culture === 'fa'
                        ? 'فراموشی رمز عبور'
                        : culture === 'ar'
                            ? 'نسيت كلمة المرور'
                            : 'Forget password'
                    }</span>
                  </div>`;

                setTimeout(() => {
                    document.querySelector(".codeContainerReForget").classList.remove("hidden")
                }, 100);
                forgetPassword.setAttribute("onclick", "forgetPassword(this)");
                if (hasCaptcha == true) {
                    loginFormMessage.innerHTML = `<span class="success">${culture === 'fa'
                        ? 'کد امنیتی معتبر است'
                        : culture === 'ar'
                            ? 'رمز الأمان صالح'
                            : 'The security code is valid'
                        }</span>`;
                    setTimeout(function () {
                        if (loginFormMessage.querySelector(".success")) {
                            loginFormMessage.querySelector(".success").remove();
                        }
                    }, 3000);
                }
                loginForm.lastChild.before(itemTempCopyForCode);
            }
        }
    } else if (errorid == "3") {
        // remaintime - less than 60 seconds
        loginFormMessage.innerHTML = `<span class="error">${culture === 'fa'
            ? `از زمان اعتبار کلید قبلی ${responseJson.remain_time} ثانیه باقی مانده است`
            : culture === 'ar'
                ? `تبقى ${responseJson.remain_time} ثانية من صلاحية المفتاح السابق`
                : `There are ${responseJson.remain_time} seconds left from the validity of the previous key`
            }</span>`;

        setTimeout(function () {
            if (loginFormMessage.querySelector(".error")) {
                loginFormMessage.querySelector(".error").remove();
            }
        }, 3000);
    } else if (errorid == "4") {
        // authentication by mobile – multi user
        const users = responseJson.users;
        loginForm.setAttribute("name", "form.selectuser");
        hashid = responseJson.hashid;
        $bc.setSource("authentication.hashid", hashid);

        // ------------------new changes ----------------
        document.querySelector("#selectUser-title").classList.remove("hidden")
        document.querySelector("#login-title").classList.add("hidden")
        firstUsernameInputValue = document.querySelector("#firstUsernameInput").value
        firstUsernameContainer = document.querySelector("#firstUsernameContainer")
        usernameBox = document.createElement("div")
        usernameBox.setAttribute("id", "usernameBoxID")
        usernameSpan = document.createElement("span")
        usernameBox.appendChild(usernameSpan)
        usernameSpan.innerHTML = firstUsernameInputValue
        firstUsernameContainer.appendChild(usernameBox)
        usernameBox.classList.add("usernameBox")
        usernameBox.innerHTML += `
 <div class="userBoxLeftSide">
 <svg width="6" height="12" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path fill-rule="evenodd" clip-rule="evenodd" d="M5.32539 0.953389C5.53505 1.1331 5.55933 1.44875 5.37962 1.65841L1.65853 5.99968L5.37962 10.341C5.55933 10.5506 5.53505 10.8663 5.32539 11.046C5.11572 11.2257 4.80007 11.2014 4.62036 10.9917L0.620363 6.32508C0.459867 6.13783 0.459867 5.86153 0.620363 5.67429L4.62036 1.00762C4.80007 0.797958 5.11572 0.773678 5.32539 0.953389Z" fill="#1C274C"/>
 </svg>
 </div>
 `
        usernameBox.setAttribute("onclick", "turnBack()")
        document.querySelector("#firstUsername").classList.add("hidden")
        document.querySelector("#captchaContainer").classList.add("hidden")
        const mailsSelectContainer = document.createElement("div")
        loginForm.lastChild.before(mailsSelectContainer);
        mailsSelectContainer.setAttribute("id", "mailsSelectContainer");
        users.forEach((element, index, array) => {
            const emailListLabel = document.createElement("label");
            emailListLabel.classList.add("email-item");
            const emailListRadio = document.createElement("input");
            emailListRadio.setAttribute("type", "radio");
            emailListRadio.setAttribute("name", "userid");
            emailListRadio.setAttribute("value", `${users[index].userid}`);
            if (index == 0) {
                emailListRadio.setAttribute("required", true);
            }
            const emailListSpan = document.createElement("span");
            emailListSpan.classList.add("email-label");
            emailListSpan.innerText = `${users[index].username}`;
            emailListLabel.appendChild(emailListRadio);
            emailListLabel.appendChild(emailListSpan);
            mailsSelectContainer.appendChild(emailListLabel)
        });

    } else if (errorid == "8") {
        loginFormMessage.innerHTML = `<span class="success">
            ${culture === 'fa'
                ? `این ایمیل برای نام کاربری دیگری ثبت گردیده‌است. ایمیل بازیابی نام کاربری برای شما ارسال شد`
                : culture === 'ar'
                    ? `تم تسجيل هذا البريد الإلكتروني لاسم مستخدم آخر. تم إرسال بريد استرداد اسم المستخدم إليك`
                    : `This email is registered for another username. Username recovery email has been sent to you`
            }
          </span>`;

        setTimeout(function () {
            if (loginFormMessage.querySelector(".success")) {
                loginFormMessage.querySelector(".success").remove();
            }
        }, 3000);
        loginForm.querySelector(".login-btn").textContent = `${culture === 'fa'
            ? 'ارسال مجدد ایمیل'
            : culture === 'ar'
                ? 'إعادة إرسال البريد الإلكتروني'
                : 'Resend email'
            }`;

    } else if (errorid == "10") {
        // invalid inputs
        loginFormMessage.innerHTML = `<span class="error">${culture === 'fa'
            ? 'ورودی های ارسال شده نامعتبر است'
            : culture === 'ar'
                ? 'المدخلات المقدمة غير صالحة'
                : 'Entries submitted are invalid'
            }</span>`;

        setTimeout(function () {
            if (loginFormMessage.querySelector(".error")) {
                loginFormMessage.querySelector(".error").remove();
            }
        }, 3000);
    } else if (errorid == "17") {
        // invalid captcha
        loginFormMessage.innerHTML = `<span class="error">${culture === 'fa'
            ? 'کد امنیتی وارد شده نامعتبر است'
            : culture === 'ar'
                ? 'رمز الأمان المدخل غير صالح'
                : 'The security code entered is invalid'
            }</span>`;

        setTimeout(function () {
            if (loginFormMessage.querySelector(".error")) {
                loginFormMessage.querySelector(".error").remove();
            }
        }, 3000);
        document.querySelector("#captchaCode").value = "";
    } else if (errorid == "53") {

        loginFormMessage.innerHTML = `<span class="success">${culture === 'fa'
            ? 'ایمیل فعالسازی مجددا برای شما ارسال شد'
            : culture === 'ar'
                ? 'تم إرسال بريد التفعيل إليك مرة أخرى'
                : 'The activation email has been sent to you again'
            }</span>`;
        setTimeout(function () {
            if (loginFormMessage.querySelector(".success")) {
                loginFormMessage.querySelector(".success").remove();
            }
        }, 3000);
        loginForm.querySelector(".login-btn").textContent = `${culture === 'fa'
            ? 'ارسال مجدد ایمیل'
            : culture === 'ar'
                ? 'إعادة إرسال البريد الإلكتروني'
                : 'Resend email'
            }`;

    } else if (errorid == "54") {
        // token is expired
        loginFormMessage.innerHTML = `<span class="error">${culture === 'fa'
            ? 'useragent نامعتبر است'
            : culture === 'ar'
                ? 'وحدة المستخدم غير صالحة'
                : 'The user agent is invalid'
            }</span>`;

        setTimeout(function () {
            if (loginFormMessage.querySelector(".error")) {
                loginFormMessage.querySelector(".error").remove();
            }
        }, 3000);
    } else if (errorid == "58") {
        // token is expired
        loginFormMessage.innerHTML = `<span class="error">${culture === 'fa'
            ? 'کاربر غیرفعال است'
            : culture === 'ar'
                ? 'المستخدم غير نشط'
                : 'The user is inactive'
            }</span>`;

        setTimeout(function () {
            if (loginFormMessage.querySelector(".error")) {
                loginFormMessage.querySelector(".error").remove();
            }
        }, 3000);
    } else if (errorid == "61") {
        // invalid inputs
        loginFormMessage.innerHTML = `<span class="error">${culture === 'fa'
            ? 'فرمت موبایل نادرست است'
            : culture === 'ar'
                ? 'تنسيق الجوال غير صحيح'
                : 'Incorrect mobile format'
            }</span>`;

        setTimeout(function () {
            if (loginFormMessage.querySelector(".error")) {
                loginFormMessage.querySelector(".error").remove();
            }
        }, 3000);
    }


}
async function onProcessedLogin(args) {
    const response = args.response;
    const responseJson = await response.json();
    const errorid = responseJson.errorid;
    if (errorid == "1") {
        // token is expired
        loginFormMessage.innerHTML = `<span class="error">${culture === 'fa'
            ? 'توکن ارسال شده نامعتبر است'
            : culture === 'ar'
                ? 'الرمز المرسل غير صالح'
                : 'The token sent is invalid'
            }</span>`;

        setTimeout(function () {
            if (loginFormMessage.querySelector(".error")) {
                loginFormMessage.querySelector(".error").remove();
            }
        }, 3000);
    } else if (errorid == '3') {
        // remaintime - less than 60 seconds
        loginFormMessage.innerHTML = `<span class="error">${culture === 'fa'
            ? `از زمان اعتبار کلید قبلی ${responseJson.remain_time} ثانیه باقی مانده است`
            : culture === 'ar'
                ? `تبقى ${responseJson.remain_time} ثانية من صلاحية المفتاح السابق`
                : `There are ${responseJson.remain_time} seconds left from the validity of the previous key`
            }</span>`;

        setTimeout(function () {
            if (loginFormMessage.querySelector(".error")) {
                loginFormMessage.querySelector(".error").remove();
            }
        }, 3000);
    } else if (errorid == "8") {
        loginFormMessage.innerHTML = `<span class="success">${culture === 'fa'
            ? `این ایمیل برای نام کاربری دیگری ثبت گردیده‌است. ایمیل بازیابی نام کاربری برای شما ارسال شد`
            : culture === 'ar'
                ? `تم تسجيل هذا البريد الإلكتروني لاسم مستخدم آخر. تم إرسال بريد استرداد اسم المستخدم إليك`
                : `This email is registered for another username. Username recovery email has been sent to you`
            }</span>`;

        setTimeout(function () {
            if (loginFormMessage.querySelector(".success")) {
                loginFormMessage.querySelector(".success").remove();
            }
        }, 3000);
        loginForm.querySelector(".login-btn").textContent = `${culture === 'fa'
            ? 'ارسال مجدد ایمیل'
            : culture === 'ar'
                ? 'إعادة إرسال البريد الإلكتروني'
                : 'Resend email'
            }`;

    } else if (errorid == "10") {
        // invalid inputs
        loginFormMessage.innerHTML = `<span class="error">${culture === 'fa'
            ? `ورودی های ارسال شده نامعتبر است`
            : culture === 'ar'
                ? `المدخلات المقدمة غير صالحة`
                : `Entries submitted are invalid`
            }</span>`;

        setTimeout(function () {
            if (loginFormMessage.querySelector(".error")) {
                loginFormMessage.querySelector(".error").remove();
            }
        }, 3000);
    } else if (errorid == "11") {
        // successful
        const rkey = responseJson.rkey;
        loginFormMessage.innerHTML = `<span class="success">${culture === 'fa'
            ? `با موفقیت وارد شدید`
            : culture === 'ar'
                ? `لقد سجلت الدخول بنجاح`
                : `You have successfully logged in`
            }</span>`;

        $bc.setSource("user.checkrkey", rkey);
        setTimeout(function () {
            if (loginFormMessage.querySelector(".success")) {
                loginFormMessage.querySelector(".success").remove();
            };
        }, 3000);
        $bc.setSource("user.rkey", rkey);
    } else if (errorid == "12") {
        // send activation email
        loginFormMessage.innerHTML = `<span class="success">${culture === 'fa'
            ? `ایمیل فعالسازی ارسال شد`
            : culture === 'ar'
                ? `تم إرسال بريد التفعيل`
                : `Activation email has been sent`
            }</span>`;

        setTimeout(function () {
            if (loginFormMessage.querySelector(".success")) {
                loginFormMessage.querySelector(".success").remove();
            }
        }, 3000);
        loginForm.querySelector(".login-btn").textContent = `${culture === 'fa'
            ? `ارسال مجدد ایمیل`
            : culture === 'ar'
                ? `إعادة إرسال البريد الإلكتروني`
                : `Resend email`
            }`;

    } else if (errorid == "13") {
        // incorrect Password
        loginFormMessage.innerHTML = `<span class="error">${culture === 'fa'
            ? `رمز عبور اشتباه است`
            : culture === 'ar'
                ? `كلمة المرور غير صحيحة`
                : `The password is incorrect`
            }</span>`;

        setTimeout(function () {
            if (loginFormMessage.querySelector(".error")) {
                loginFormMessage.querySelector(".error").remove();
            }
        }, 3000);
    } else if (errorid == "14") {
        // Password and the repetition are not match
        loginFormMessage.innerHTML = `<span class="error">${culture === 'fa'
            ? `رمز عبور و تکرار آن مطابقت ندارد`
            : culture === 'ar'
                ? `كلمة المرور وتكرارها لا تتطابق`
                : `The password and its repetition do not match`
            }</span>`;

        setTimeout(function () {
            if (loginFormMessage.querySelector(".error")) {
                loginFormMessage.querySelector(".error").remove();
            }
        }, 3000);
    } else if (errorid == "16") {
        // invalid code
        loginFormMessage.innerHTML = `<span class="error">${culture === 'fa'
            ? `کد ارسال شده اشتباه است`
            : culture === 'ar'
                ? `الكود المرسل غير صحيح`
                : `The code sent is incorrect`
            }</span>`;

        setTimeout(function () {
            if (loginFormMessage.querySelector(".error")) {
                loginFormMessage.querySelector(".error").remove();
            }
        }, 3000);
    } else if (errorid == "19") {
        // invalid email format
        loginFormMessage.innerHTML = `<span class="error">${culture === 'fa'
            ? `کد ارسال شده اشتباه است`
            : culture === 'ar'
                ? `تنسيق البريد الإلكتروني المدخل غير صحيح`
                : `The email format entered is incorrect`
            }</span>`;

        setTimeout(function () {
            if (loginFormMessage.querySelector(".error")) {
                loginFormMessage.querySelector(".error").remove();
            }
        }, 3000);
    } else if (errorid == "26") {
        // this user exists
        loginFormMessage.innerHTML = `<span class="error">${culture === 'fa'
            ? `این نام کاربری توسط کاربر دیگری ثبت گردید`
            : culture === 'ar'
                ? `اسم المستخدم هذا مسجل من قبل مستخدم آخر`
                : `This username was registered by another user`
            }</span>`;

        setTimeout(function () {
            if (loginFormMessage.querySelector(".error")) {
                loginFormMessage.querySelector(".error").remove();
            }
        }, 3000);
    } else if (errorid == "55") {
        // this user is already logged in
        const rkey = responseJson.rkey;
        loginFormMessage.innerHTML = `<span class="success">${culture === 'fa'
            ? `با موفقیت وارد شدید`
            : culture === 'ar'
                ? `لقد قمت بتسجيل الدخول بنجاح`
                : `You have successfully logged in`
            }</span>`;

        $bc.setSource("user.checkrkey", rkey);
        setTimeout(function () {
            if (loginFormMessage.querySelector(".success")) {
                loginFormMessage.querySelector(".success").remove();
            }
        }, 3000);
        $bc.setSource("user.rkey", rkey);
    } else if (errorid == "56") {
        // please login by this email
        loginFormMessage.innerHTML = `<span class="success">${culture === 'fa'
            ? `این ایمیل برای نام کاربری دیگری ثبت گردیده‌است و می‌توانید با آن لاگین کنید.`
            : culture === 'ar'
                ? `تم تسجيل هذا البريد الإلكتروني لاسم مستخدم آخر ويمكنك تسجيل الدخول باستخدامه.`
                : `This email is registered for another username and you can log in with it.`
            }</span>`;

        setTimeout(function () {
            if (loginFormMessage.querySelector(".success")) {
                loginFormMessage.querySelector(".success").remove();
            }
        }, 3000);
    }



}
async function onProcessedCheckrkey(args) {
    const response = args.response;
    const responseJson = await response.json();
    if (responseJson.checked == true) {
        var passengerList_key = loginForm.querySelector(".passengerList-key").value;
        var internal_key = loginForm.querySelector(".internal-key").value;
        var index_key = loginForm.querySelector(".index-key").value;
        var index_room_key = loginForm.querySelector(".index-room-key").value;
        if (document.querySelector(".main-userid")) {
            document.querySelector(".main-userid").value = responseJson.userid
            if (document.querySelector(".main-rkey")) {
                document.querySelector(".main-rkey").value = responseJson.rkey
                document.querySelector(".check-commission").querySelector(".userid").value = responseJson.userid
                fetch(document.querySelector(".check-commission").getAttribute("action"), {
                    method: "POST",
                    body: new FormData(document.querySelector(".check-commission"))
                }).then(response => response.text()).then(text => {
                    document.querySelector(".check-commission-response").innerHTML = text;
                    var scripts = document.querySelector(".check-commission-response").getElementsByTagName("script");
                    for (var i = 0; i < scripts.length; i++) {
                        var scriptTag = document.createElement("script");

                        if (scripts[i].src) {
                            scriptTag.src = scripts[i].src;
                            scriptTag.async = false;
                        } else {
                            scriptTag.text = scripts[i].textContent;
                        }

                        document.head.appendChild(scriptTag).parentNode.removeChild(scriptTag);
                    }
                }).catch(error => console.error(error))
                if (passengerList_key == '1') {
                    if (index_room_key) {
                        for (var i = 0; i < document.getElementsByClassName("passenger-info-content").length; i++) {
                            for (var j = 0; j < document.getElementsByClassName("passenger-info-content")[i].getElementsByClassName("passenger").length; j++) {
                                document.getElementsByClassName("passenger-info-content")[i].getElementsByClassName("passenger")[j].querySelector(".prev-passengers").setAttribute("data-open", 1);
                            }
                        }
                        load_passengersList(responseJson.dmnid, responseJson.userid, internal_key, index_key, index_room_key);
                    } else {
                        for (var i = 0; i < document.getElementsByClassName("passenger-info-content").length; i++) {
                            document.getElementsByClassName("passenger-info-content")[i].querySelector(".prev-passengers").setAttribute("data-open", 1);
                        }
                        load_passengersList(responseJson.dmnid, responseJson.userid, internal_key, index_key);
                    }
                } else {
                    document.querySelector(".package-container") &&
                        document.querySelector(".next-btn") &&
                        "passenger" !== document.querySelector(".next-btn").getAttribute("data-step") &&
                        (document.querySelector(".passengers-info-content").classList.add("hidden"),
                            document.querySelector(".buyers-info-content").classList.remove("hidden"),
                            (document.querySelector(".step-title").innerText =
                                culture == 'fa' ? `مشخصات خریدار` :
                                    culture == 'ar' ? `تفاصيل المشتري` :
                                        `Buyer Details`),
                            document.querySelector(".next-btn").setAttribute("data-step", "buyer"),
                            document.querySelector(".next-btn").previousElementSibling.classList.remove("hidden"),
                            document.querySelector(".next-btn").previousElementSibling.setAttribute("data-step", "buyer"),
                            check_steps("buyer"));

                }
            }
            const previousPassengersGrid = document.querySelector('.book-previous__passengers__container');
            if (previousPassengersGrid) {
                if (passengerList_key == '1') {
                    $bc.setSource("cms.previousPassengers", { rkey: responseJson.rkey });
                    const passengerInfoElements = document.getElementsByClassName("book-passenger__container");
                    Array.from(passengerInfoElements).forEach(infoContent => {
                        if (!infoContent.parentElement.classList.contains("book-hidden")) {
                            const passengers = infoContent.getElementsByClassName("book-passenger");
                            if (passengers.length > 0) {
                                Array.from(passengers).forEach(passenger => {
                                    passenger.querySelector(".book-previous__passenger__container").setAttribute("data-run", 1);
                                    passenger.querySelector(".book-previous__passenger__container").classList.remove("book-selected__passenger")
                                });
                            } else {
                                infoContent.querySelector(".book-previous__passenger__container").setAttribute("data-run", 1);
                                infoContent.classList.remove("book-selected__passenger")
                            }
                            if (infoContent.dataset.index == index_key) {
                                infoContent.classList.add("book-selected__passenger")
                            }
                        }

                    });

                } else {
                    document.querySelector(".book-main__container") &&
                        document.querySelector(".next__btn") &&
                        "passenger" !== document.querySelector(".book-next__btn").getAttribute("data-step") &&
                        (document.querySelector(".book-passengers__container").classList.add("hidden"),
                            document.querySelector(".book-buyers__container").classList.remove("hidden"),
                            (document.querySelector(".book-current__route__map").innerText =
                                culture == 'fa' ? `مشخصات خریدار` :
                                    culture == 'ar' ? `تفاصيل المشتري` :
                                        `Buyer Details`),
                            document.querySelector(".book-next__btn").setAttribute("data-step", "buyer"),
                            document.querySelector(".book-next__btn").previousElementSibling.classList.remove("hidden"),
                            document.querySelector(".book-next__btn").previousElementSibling.setAttribute("data-step", "buyer"),
                            updateStepItems("buyer"));

                }
                $bc.setSource("cms.buyer", true);
                document.querySelector(".book-buyers__container").setAttribute("data-run", 1);
            } else {
                $bc.setSource("db.runBuyer", {
                    userid: responseJson.userid,
                    provider: "",
                    run: true
                });
            }

        }

        const element = document.querySelector('.load-search-box-in-condition');
        if (element) {
            fetch("/Client_User_Type.inc", {
                method: "POST",
                body: `userid: ${responseJson.userid}`
            }).then(response => response.text()).then(text => {

                if (text == '2' || text == '1') {
                    try {

                        if (document.querySelector(".after-login-section") && document.querySelector(".after-login-section").classList.contains("hidden")) {
                            document.querySelector(".after-login-section").classList.remove("hidden");
                            const credit = document.querySelector(".after-login-section").dataset.credit;
                            if (credit) {
                                if (text == '2') {
                                    $bc.setSource("cms.get_agency_counter_credit", true);
                                }
                            }
                        }



                        if (element.classList.contains("hidden")) {
                            element.classList.remove("hidden");
                        }
                        element.style.setProperty('display', 'block', 'important');



                        if (document.querySelector(".check-user-page")) {
                            if (document.querySelector(".check-user-page").querySelectorAll(".hidden-part")[0]) {
                                document.querySelector(".check-user-page").querySelectorAll(".hidden-part").forEach(e => {
                                    e.remove()
                                })
                                document.querySelector(".check-user-page").querySelector("#registerbox").className = "";
                                document.querySelector(".check-user-page").querySelector(".user-entrance-body").remove();

                            }
                        }
                        const urlParams = new URLSearchParams(window.location.search);
                        const lid = urlParams.get("lid");
                        const lang = document.documentElement.getAttribute("lang");
                        let url = "/search-engine.bc";
                        if (lid === "1" || lang === "fa") {
                            url += "?lid=1";
                        } else if (lid === "2" || lang === "en") {
                            url += "?lid=2";
                        } else if (lid === "3" || lang === "ar") {
                            url += "?lid=3";
                        }

                        fetch(`${url}`)
                            .then(response => response.text())
                            .then(data => {
                                element.innerHTML = data;
                                document.body.classList.add("searchbox-load-success");
                                if (document.getElementById('search-box').classList.contains("flighttypedropdown")) {
                                    const r = document.querySelector('.flighttype-field');
                                    r.classList.add('flighttype-dropDown');
                                };
                                var scripts = element.getElementsByTagName("script");
                                for (var i = 0; i < scripts.length; i++) {
                                    var scriptTag = document.createElement("script");

                                    if (scripts[i].src) {
                                        scriptTag.src = scripts[i].src;
                                        scriptTag.async = false;
                                    } else {
                                        scriptTag.text = scripts[i].textContent;
                                    }

                                    document.head.appendChild(scriptTag).parentNode.removeChild(scriptTag);
                                }
                            })
                            .catch(error => console.error('Error loading content:', error));



                    }
                    catch (err) {
                        console.error(err.lineNumber + ',' + err.message);
                    }

                }
            }).catch(error => console.error(error))
        }
        if (document.querySelector(".user-entrance-body").classList.contains("single-page")) {
            document.querySelector(".user-entrance-body").querySelector(".dashboard-link").classList.remove("hidden")
        } else {
            document.querySelector(".user-entrance-body").style.display = "none";
            if (document.querySelector(".btnstyle")) {
                document.querySelector(".btnstyle").remove();
            }
            $bc.setSource("user.profile", true);
        }



    }


}

async function onProcessedSelectUser(args) {
    const response = args.response;
    const responseJson = await response.json();
    const errorid = responseJson.errorid;

    if (errorid == "1") {
        // token is expired
        loginFormMessage.innerHTML = `<span class="error">${culture === 'fa'
            ? `توکن ارسال شده نامعتبر است`
            : culture === 'ar'
                ? `الرمز المرسل غير صالح`
                : `The token sent is invalid`
            }</span>`;

        setTimeout(function () {
            if (loginFormMessage.querySelector(".error")) {
                loginFormMessage.querySelector(".error").remove();
            }
        }, 3000);
    } else if (errorid == '3') {
        // remaintime - less than 60 seconds
        loginFormMessage.innerHTML = `<span class="error">${culture === 'fa'
            ? `از زمان اعتبار کلید قبلی ${responseJson.remain_time} ثانیه باقی مانده است`
            : culture === 'ar'
                ? `تبقى ${responseJson.remain_time} ثانية من صلاحية المفتاح السابق`
                : `There are ${responseJson.remain_time} seconds left from the validity of the previous key`
            }</span>`;

        setTimeout(function () {
            if (loginFormMessage.querySelector(".error")) {
                loginFormMessage.querySelector(".error").remove();
            }
        }, 3000);
    } else if (errorid == "10") {
        // invalid inputs
        loginFormMessage.innerHTML = `<span class="error">${culture === 'fa'
            ? `ورودی‌های ارسال شده نامعتبر است`
            : culture === 'ar'
                ? `المدخلات المقدمة غير صالحة`
                : `Entries submitted are invalid`
            }</span>`;


        setTimeout(function () {
            if (loginFormMessage.querySelector(".error")) {
                loginFormMessage.querySelector(".error").remove();
            }
        }, 3000);
    } else if (errorid == "15") {
        // invalid username
        loginFormMessage.innerHTML = `<span class="error">${culture === 'fa'
            ? `کاربر نامعتبر است`
            : culture === 'ar'
                ? `المستخدم غير صالح`
                : `The user is invalid`
            }</span>`;


        setTimeout(function () {
            if (loginFormMessage.querySelector(".error")) {
                loginFormMessage.querySelector(".error").remove();
            }
        }, 3000);
    } else if (errorid == "2") {
        document.querySelector("#login-title").classList.add("hidden")
        document.querySelector("#selectUser-title").classList.add("hidden")
        // --------------new--------------

        document.querySelector("#mailsSelectContainer").classList.add("hidden")

        // ok
        loginFormMessage.innerHTML = `<span class="success">${culture === 'fa'
            ? `کد احراز هویت از طریق پیامک ارسال شد`
            : culture === 'ar'
                ? `تم إرسال رمز المصادقة عبر الرسائل القصيرة`
                : `The authentication code was sent via SMS`
            }</span>`;

        setTimeout(function () {
            if (loginFormMessage.querySelector(".success")) {
                loginFormMessage.querySelector(".success").remove();
            }
        }, 3000);
        loginForm.setAttribute("name", "form.login");
        hashid = responseJson.hashid;
        $bc.setSource("authentication.hashid", hashid);
        const itemTempCopyForCode = itemTempContainer.cloneNode(true);
        itemTempCopyForCode
            .querySelector(".itemInput")
            .setAttribute("name", "code");
        itemTempCopyForCode
            .querySelector(".itemInput").focus();
        itemTempCopyForCode
            .querySelector(".itemInput")
            .setAttribute("placeholder", `${culture === 'fa'
                ? `کد ارسال شده را وارد کنید...`
                : culture === 'ar'
                    ? `أدخل الرمز...`
                    : `Enter the code...`
                }`);

        loginForm.lastChild.before(itemTempCopyForCode);
        const resendSMS = loginForm.querySelector(".resendSMS");
        resendSMS.innerHTML = `<div class="codeContainerRe">
            <span id="resendCodeSMS">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 0 0-2.134 0l-1.022.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V8.844a2.25 2.25 0 0 1 1.183-1.981l7.5-4.039a2.25 2.25 0 0 1 2.134 0l7.5 4.039a2.25 2.25 0 0 1 1.183 1.98V19.5Z" />
              </svg>
            </span>
            <span class="resendCodeText">${culture === 'fa'
                ? `ارسال مجدد کد...`
                : culture === 'ar'
                    ? `إعادة إرسال الرمز...`
                    : `Resend the code`
            }</span>
          </div>`;


        resendCodeSMSVar = document.querySelector("#resendCodeSMS")
        if (resendCodeSMSVar) {
            resendCodeSMSVar.classList.remove("hidden")

        }
        countDownContainer = document.querySelector("#countDownContainer")
        const countDownText = document.createElement("div")
        countDownText.classList.add("countDown")
        countDownContainer.appendChild(countDownText)
        let seconds = 60;
        let countDown = setInterval(function () {
            seconds--;
            seconds = seconds.toLocaleString(undefined, {
                minimumIntegerDigits: 2,
            });

            countDownText.textContent = ` 00 : ${seconds} `;
            if (seconds < 1) {
                clearInterval(countDown);
                resendSMS.classList.remove("disabled");
                resendSMS.setAttribute("onclick", "resendSMS(this, 2)");
                countDownContainer.querySelector(".countDown") ? countDownContainer.querySelector(".countDown").remove() : '';
                countDownContainer.classList.add("hidden")
            }
        }, 1000);


    } else if (errorid == "50") {
        // invalid username
        loginFormMessage.innerHTML = `<span class="error"> 
            ${culture === 'fa'
                ? `تعداد ارسال پیامک برای این سرویس به پایان رسیده است`
                : culture === 'ar'
                    ? `انتهى عدد الرسائل النصية المرسلة لهذه الخدمة`
                    : `The number of SMS sent for this service has ended`}
        </span>`;

        setTimeout(function () {
            if (loginFormMessage.querySelector(".error")) {
                loginFormMessage.querySelector(".error").remove();
            }
        }, 3000);
    }



}

async function onProcessedForgetPassword(args) {
    const response = args.response;
    const responseJson = await response.json();
    const errorid = responseJson.errorid;
    if (errorid == "1") {
        // token is expired
        loginFormMessage.innerHTML = `<span class="error">${culture === 'fa' ? `توکن ارسال شده نامعتبر است` : culture === 'ar' ? `الرمز المرسل غير صالح` : `The token sent is invalid`}</span>`;

        setTimeout(function () {
            if (loginFormMessage.querySelector(".error")) {
                loginFormMessage.querySelector(".error").remove();
            }
        }, 3000);
    } else if (errorid == "3") {
        // remaintime - less than 60 seconds
        loginFormMessage.innerHTML = `<span class="error">
            ${culture === 'fa' ? `از زمان اعتبار کلید قبلی ${responseJson.remain_time} ثانیه باقی مانده است` :
                culture === 'ar' ? `تبقى ${responseJson.remain_time} ثانية على صلاحية المفتاح السابق` :
                    `There are ${responseJson.remain_time} seconds remaining until the previous key expires`}
        </span>`;

        setTimeout(function () {
            if (loginFormMessage.querySelector(".error")) {
                loginFormMessage.querySelector(".error").remove();
            }
        }, 3000);

    } else if (errorid == "10") {
        // invalid inputs
        loginFormMessage.innerHTML = `<span class="error">
            ${culture === 'fa' ? `ورودی های ارسال شده نامعتبر است` :
                culture === 'ar' ? `المدخلات المقدمة غير صالحة` :
                    `Entries submitted are invalid`}
        </span>`;

        setTimeout(function () {
            if (loginFormMessage.querySelector(".error")) {
                loginFormMessage.querySelector(".error").remove();
            }
        }, 3000);
    } else if (errorid == "15") {
        // invalid username
        loginFormMessage.innerHTML = `<span class="error">
    ${culture === 'fa' ? `کاربر نامعتبر است` :
                culture === 'ar' ? `المستخدم غير صالح` :
                    `The user is invalid`}
</span>`;

        setTimeout(function () {
            if (loginFormMessage.querySelector(".error")) {
                loginFormMessage.querySelector(".error").remove();
            }
        }, 3000);
    } else if (errorid == "35") {
        // username format is mobile
        loginFormMessage.innerHTML = `<span class="error">
            ${culture === 'fa' ? `استفاده از فراموشی رمز عبور فقط برای نام کاربری یا ایمیل امکان‌پذیر است` :
                culture === 'ar' ? `يمكن استخدام نسيان كلمة المرور فقط لاسم المستخدم أو البريد الإلكتروني` :
                    `It is possible to use forget password only for username or email`}
        </span>`;

        setTimeout(function () {
            if (loginFormMessage.querySelector(".error")) {
                loginFormMessage.querySelector(".error").remove();
            }
        }, 3000);
    } else if (errorid == "36") {
        // ok with multi connection way
        const users = responseJson.data;
        loginForm.setAttribute("name", "form.selectchangepassmethod");
        userid = responseJson.userid;
        $bc.setSource("forgetpassword.userid", userid);

        // -------new changes -------
        usernameBoxID = document.querySelector("#usernameBoxID")
        document.querySelector("#firstUsername").classList.add("hidden")
        const emailListContainer = document.createElement("div");
        emailListContainer.setAttribute("id", "emailListContainer");
        loginForm.lastChild.before(emailListContainer);
        emailListContainer.classList.remove("hidden")
        const inputHidden = document.createElement("input");
        inputHidden.setAttribute("type", "hidden");
        inputHidden.setAttribute("name", "user");
        emailListContainer.appendChild(inputHidden)
        users.forEach((element, index, array) => {
            const emailListLabel = document.createElement("label");
            emailListLabel.classList.add("email-item");
            const emailListRadio = document.createElement("input");
            emailListRadio.setAttribute("type", "radio");
            emailListRadio.setAttribute("name", "ismobile");
            emailListRadio.setAttribute("value", `${users[index].ismobile}`);
            if (index == 0) {
                emailListRadio.setAttribute("required", true);
            }
            emailListRadio.setAttribute(
                "onclick",
                "selectUserForForgetPass(this)"
            );

            const emailListSpan = document.createElement("span");
            emailListSpan.classList.add("email-label");
            if (element.ismobile) {
                emailListRadio.setAttribute(
                    "data-user",
                    `${users[index].mobile}`
                );
                emailListSpan.innerText = `${users[index].mobile}`;
            } else {
                emailListRadio.setAttribute(
                    "data-user",
                    `${users[index].email}`
                );
                emailListSpan.innerText = `${users[index].email}`;
            }

            emailListLabel.appendChild(emailListRadio);
            emailListLabel.appendChild(emailListSpan);
            emailListContainer.appendChild(emailListLabel)
        });
        emailListContainer.classList.remove("hidden")
    } else if (errorid == "42") {
        // ok with one connection way
        // The password change link sent to email
        loginFormMessage.innerHTML = `<span class="success"> 
            ${culture === 'fa' ? `لینک تغییر رمز عبور از طریق ایمیل ارسال شد` :
                culture === 'ar' ? `تم إرسال رابط تغيير كلمة المرور عبر البريد الإلكتروني` :
                    `The password change link was sent via email`}
        </span>`;

        setTimeout(function () {
            if (loginFormMessage.querySelector(".success")) {
                loginFormMessage.querySelector(".success").remove();
            }
        }, 3000);
        loginForm.querySelector(".login-btn").textContent = `${culture == 'fa' ? `ارسال مجدد لینک` :
            culture == 'ar' ? `إعادة إرسال الرابط` :
                `Repost the link`}`;

    } else if (errorid == "58") {
        // user is deactive
        loginFormMessage.innerHTML = `<span class="error"> ${culture == 'fa' ? `کاربر غیرفعال است` :
            culture == 'ar' ? `المستخدم غير نشط` :
                `The user is inactive`} </span>`;

        setTimeout(function () {
            if (loginFormMessage.querySelector(".error")) {
                loginFormMessage.querySelector(".error").remove();
            }
        }, 3000);
    }



}
async function onProcessedSelectChangePassMethod(args) {
    const response = args.response;
    const responseJson = await response.json();
    const errorid = responseJson.errorid;
    if (errorid == "1") {
        // token is expired
        loginFormMessage.innerHTML = `<span class="error">${culture == 'fa' ? `توکن ارسال شده نامعتبر است` :
            culture == 'ar' ? `التوكن المرسل غير صالح` :
                `The token sent is invalid`}</span>`;

        setTimeout(function () {
            if (loginFormMessage.querySelector(".error")) {
                loginFormMessage.querySelector(".error").remove();
            }
        }, 3000);
    } else if (errorid == "3") {
        // remaintime - less than 60 seconds
        loginFormMessage.innerHTML = `<span class="error"> ${culture == 'fa' ? `از زمان اعتبار کلید قبلی ${responseJson.remain_time} ثانیه باقی مانده است` :
            culture == 'ar' ? `تبقى ${responseJson.remain_time} ثانية من صلاحية المفتاح السابق` :
                `Remaining time for the previous key is ${responseJson.remain_time} seconds`}</span>`;

        setTimeout(function () {
            if (loginFormMessage.querySelector(".error")) {
                loginFormMessage.querySelector(".error").remove();
            }
        }, 3000);

    } else if (errorid == "10") {
        // invalid inputs
        loginFormMessage.innerHTML = `<span class="error"> 
    ${culture == 'fa' ? `ورودی های ارسال شده نامعتبر است` :
                culture == 'ar' ? `المدخلات المقدمة غير صالحة` :
                    `Entries submitted are invalid`} 
</span>`;

        setTimeout(function () {
            if (loginFormMessage.querySelector(".error")) {
                loginFormMessage.querySelector(".error").remove();
            }
        }, 3000);
    } else if (errorid == "40") {
        // invalid user
        loginFormMessage.innerHTML = `<span class="error"> 
            ${culture == 'fa' ? `آی دی کاربر معتبر نیست` :
                culture == 'ar' ? `معرف المستخدم غير صالح` :
                    `The user ID is not valid`} 
        </span>`;

        setTimeout(function () {
            if (loginFormMessage.querySelector(".error")) {
                loginFormMessage.querySelector(".error").remove();
            }
        }, 3000);
    } else if (errorid == "41") {
        // The password change link sent to mobile
        loginFormMessage.innerHTML = `<span class="success"> 
            ${culture == 'fa' ? `لینک تغییر رمز عبور از طریق پیامک ارسال شد` :
                culture == 'ar' ? `تم إرسال رابط تغيير كلمة المرور عبر الرسائل القصيرة` :
                    `The password change link was sent via SMS`} 
        </span>`;



        setTimeout(function () {
            if (loginFormMessage.querySelector(".success")) {
                loginFormMessage.querySelector(".success").remove();
            }
        }, 3000);
        loginForm.querySelector(".login-btn").textContent = `${culture == 'fa' ? `ارسال مجدد لینک` :
            culture == 'ar' ? `إعادة إرسال الرابط` :
                `Repost the link`}`;

    } else if (errorid == "42") {
        // The password change link sent to email
        loginFormMessage.innerHTML = `<span class="success">
            ${culture == 'fa' ? `لینک تغییر رمز عبور از طریق ایمیل ارسال شد` :
                culture == 'ar' ? `تم إرسال رابط تغيير كلمة المرور عبر البريد الإلكتروني` :
                    `The password change link was sent via email`}
        </span>`;
        setTimeout(function () {
            if (loginFormMessage.querySelector(".success")) {
                loginFormMessage.querySelector(".success").remove();
            }
        }, 3000);
        loginForm.querySelector(".login-btn").textContent = `${culture == 'fa' ? `ارسال مجدد لینک` :
            culture == 'ar' ? `إعادة إرسال الرابط` :
                `Repost the link`}`;
    }

}

try {
    // Check if the value of the element with the class 'company-ownerid' matches one of the specified IDs
    if (
        agencySignup === 'true'
    ) {
        // If the condition is met, insert an HTML link to a registration form PDF before the login form
        loginForm.insertAdjacentHTML(
            'beforebegin',
            `<div class="sign-form"><a target="_blank" href="/images/form-sign.pdf">${culture == 'fa' ? `فرم ثبت نام همکار` : `Agency user information confirmation form`}</a></div>`
        );
    }
    if (
        document.querySelector(".company-ownerid").value == '9407'
    ) {
        // If the condition is met, insert an HTML link to a registration form PDF before the login form
        loginForm.insertAdjacentHTML(
            'beforebegin',
            `<div class="sign-form"><a target="_blank" href="/images/VISA.pdf">Visa contract</a></div>`
        );
    }
    if (
        document.querySelector(".company-ownerid").value == '9532'
    ) {
        // If the condition is met, insert an HTML link to a registration form PDF before the login form
        loginForm.insertAdjacentHTML(
            'beforebegin',
            `<div class="sign-form"><a href="/pdf/SignUpFormFinal.pdf" target="_blank" class="confirmation-form-link">Agency Registration Form</a><a href="/pdf/RequestSubmissionTutorial.pdf" target="_blank" class="confirmation-form-link">Request Submission Tutorial</a><a href="/pdf/SignUpTutorial.pdf" target="_blank" class="confirmation-form-link">Sign Up Tutorial</a></div>`
        );
    }
} catch (err) {
    // If any error occurs, log the error's line number and message to the console
    console.error(err.lineNumber + ',' + err.message);
}
// ALa web service

function detectInputType(element) {
    let inputElement = convertToEnglishNumbers(element.value);
    // Trim input to remove leading/trailing spaces
    inputElement = inputElement.trim();
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Regular expression for phone number validation (supports various formats)
    const phoneRegex = /^\+?\d{1,4}?[-.\s]?(\(?\d{1,3}?\))?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
    if (emailRegex.test(inputElement)) {
    } else if (phoneRegex.test(inputElement)) {
        if (ownerEl.getAttribute("data-country") == '1') {
        } else {
            for (const element of ala_json) {
                if (loginForm?.querySelector(".countryCodes__loader")) {
                    loginForm?.querySelector(".countryCodes__loader").remove();
                };
                loginForm?.querySelector("#firstUsername").insertAdjacentHTML('beforeend', `<span class="countryCodes__loader"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" style="width: 20px;height: 20px;"><radialGradient id="a9" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)"><stop offset="0" stop-color="#000000"/><stop offset=".3" stop-color="#000000" stop-opacity=".9"/><stop offset=".6" stop-color="#000000" stop-opacity=".6"/><stop offset=".8" stop-color="#000000" stop-opacity=".3"/><stop offset="1" stop-color="#000000" stop-opacity="0"/></radialGradient><circle transform-origin="center" fill="none" stroke="url(#a9)" stroke-width="15" stroke-linecap="round" stroke-dasharray="200 1000" stroke-dashoffset="0" cx="100" cy="100" r="70"><animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="2" values="360;0" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite"/></circle><circle transform-origin="center" fill="none" opacity=".2" stroke="#000000" stroke-width="15" stroke-linecap="round" cx="100" cy="100" r="70"/></svg>
</span>`);
                if (element.ownerid == document.querySelector(".company-ownerid").value) {
                    $bc.setSource("db.countryCodes", true);
                    tellCode = element.code;
                }
            }
        }
    }
}
async function onProcessedCountryCodes(args) {
    const firstUsername = loginForm?.querySelector("#firstUsername");
    const countryCodesLoader = loginForm?.querySelector(".countryCodes__loader");
    countryCodesLoader.remove();
    const response = args.response;
    const responseJson = await response.json();
    let output = `<div class="country-code" onclick="toggleCountryLoginCode(this)"><svg class="icon-CountryLoginCode" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#004B85" width="20px"
  height= "20px">
  <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
</svg>
<input class="id-loginCode" value="${tellCode}" oninput="autoCompleteFilter(this)"/><ul class="drop-id-loginCode hidden">`;
    for (const item of responseJson) {
        output += `<li data-id="${item.code}" onclick="selectCountryLoginCode(this)"><span>${item.title}</span><span class="response__code">(${item.code})</span></li>`

    }
    output += `</ul>`;
    ownerEl.setAttribute("data-country", '1');
    firstUsername.insertAdjacentHTML('beforeend', output);

}
function selectCountryLoginCode(element) {
    const form = element.closest("form");
    if (!form) return;

    const codeInput = form.querySelector(".id-loginCode");
    const usernameInput = form.querySelector("#firstUsernameInput");

    if (codeInput) {
        codeInput.value = element.dataset.id || "";
    }

    if (usernameInput) {
        usernameInput.value = ''
        usernameInput.setAttribute("data-value", '');
    }
}

function toggleCountryLoginCode(element) {
    element.closest("form").querySelector(".drop-id-loginCode").classList.toggle("hidden");
    element.closest("form").querySelector(".icon-CountryLoginCode").classList.toggle("transfer-toggle");
}
//  filter data
function autoCompleteFilter(element) {
    try {
        if (element.closest("#firstUsername").querySelector(".drop-id-loginCode").classList.contains("hidden")) {
            element.closest("#firstUsername").querySelector(".drop-id-loginCode").classList.remove("hidden")
        }
        let count = 0;
        element.closest("#firstUsername").querySelector(".drop-id-loginCode").querySelectorAll("li").forEach(e => {
            if (e.dataset.value ? e.dataset.value.toLowerCase().includes(element.value.toLowerCase()) || e.dataset.id.toLowerCase().includes(element.value.toLowerCase()) : e.innerText.toLowerCase().includes(element.value.toLowerCase())) {
                count++;
                e.classList.remove('hidden')
            } else {
                e.classList.add('hidden')
            }
        })
        if (count == 0) {
            element.closest("#firstUsername").querySelector(".drop-id-loginCode").insertAdjacentHTML('beforeend', `<li class="nodata" data-id="">
                 ${culture === 'fa'
                    ? 'موردی یافت نشد'
                    : culture === 'ar'
                        ? 'لم يتم العثور على أي عناصر'
                        : 'No items found'
                }
                 </li>`)
        } else {
            if (element.closest("#firstUsername").querySelector(".drop-id-loginCode").querySelector(".nodata")) { element.closest("#firstUsername").querySelector(".drop-id-loginCode").querySelector(".nodata").remove() }
        }
    } catch (err) {
        console.error('autoCompleteFilter=' + err.lineNumber + ',' + err.message);
    }
}

document.addEventListener('click', function (event) {
    if (!event.target.closest('.country-code')) {
        document.querySelectorAll(".drop-id-loginCode").forEach(e => e.classList.add(
            "hidden"));
    }
});
function checkUsername() {
    if (loginForm?.querySelector(".id-loginCode")) {
        const loginCode = convertToEnglishNumbers(loginForm?.querySelector(".id-loginCode")?.value) || "";
        const usernameInput = convertToEnglishNumbers(loginForm?.querySelector("input[name='username']")?.getAttribute("data-value"));
        username = loginCode + usernameInput;
    } else {
        const usernameInput = convertToEnglishNumbers(loginForm?.querySelector("input[name='username']")?.value) || "";
        username = usernameInput;
    }
    // Fix: Ensure the element exists before assigning the value
    const usernameField = loginForm?.querySelector("input[name='username']");
    if (usernameField) {
        usernameField.value = username;
    }
}
function convertToEnglishNumbers(str) {
    if (!str) return str;
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let result = str.toString();
    for (let i = 0; i < 10; i++) {
        result = result.replace(new RegExp(persianNumbers[i], 'g'), englishNumbers[i]);
        result = result.replace(new RegExp(arabicNumbers[i], 'g'), englishNumbers[i]);
    }
    return result;
}
document.addEventListener('input', function (e) {
    if (e.target.matches('input[type="text"], input[name="code"], input[name="mobile"], input[name="captchaid"]')) {
        const cursorPosition = e.target.selectionStart;
        const originalValue = e.target.value;
        const convertedValue = convertToEnglishNumbers(originalValue);
        if (originalValue !== convertedValue) {
            e.target.value = convertedValue;
            e.target.setSelectionRange(cursorPosition, cursorPosition);
        }
    }
});
