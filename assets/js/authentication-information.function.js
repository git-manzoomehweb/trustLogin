// Function to check if a specific cookie exists and return its value
function checkCookie(cname) {
    // Construct the name of the cookie with the provided cname followed by '='
    var name = cname + "=";

    // Decode the document.cookie string in case any special characters were encoded
    var decodedCookie = decodeURIComponent(document.cookie);

    // Split the cookie string into individual cookies based on ';' delimiter
    var ca = decodedCookie.split(';');

    // Loop through each cookie in the array
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];

        // Remove any leading spaces from the cookie string
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }

        // Check if the cookie starts with the desired name
        if (c.indexOf(name) == 0) {
            // If found, return the value of the cookie (everything after the name)
            return c.substring(name.length, c.length);
        }
    }

    // Return an empty string if the cookie is not found
    return "";
}

// Function to confirm logout by calling a backend function to execute the logout
function logoutConfirm() {
    // Set the source to run the logout action on the backend (db.runLogout)
    $bc.setSource("db.runLogout", true);
}

// Function to set the domain token and pass it to the logout request
function setDmnTokenForLogout() {
    // Retrieve the domain token value from the input field with ID 'dmntoken'
    const thisdmntoken = document.getElementById("dmntoken").value;

    // Assign the retrieved value to the global 'dmntoken' variable
    dmntoken = thisdmntoken;

    // Set the source to call the backend logout action (db.logout), passing the 'rkey' cookie value and the domain token
    $bc.setSource("db.logout", {
        value: checkCookie("rkey"),  // Get the 'rkey' cookie value using the checkCookie function
        run: true,                   // Run the logout process
        dmntoken: dmntoken,          // Include the domain token in the logout request
    });
}

// Function to erase a specific cookie by setting its expiry date in the past
function eraseCookie(name) {
    // Set the cookie with the given name to an empty value and set Max-Age to a negative value to effectively delete it
    document.cookie = name + "=; Max-Age=-99999999; path=/";
}

// Hide Auth DropDown when click outside
document.addEventListener("click", function (event) {
    if (!event.target.closest(".user-profile-container") && !event.target.classList.contains("user-profile-container")) {
        const profileContent = document.querySelector(".user-profile-content");
        const arrowElement = document.querySelector(".user-profile-arrow");
        profileContent.classList.add("hidden");
        profileContent.classList.remove("open-up");
        profileContent.classList.remove("open-left");
        profileContent.classList.remove("open-right");
        arrowElement.classList.remove("upDown");
    }
});

// // Function to show or hide the profile container and toggle the arrow direction
function showProfileContainer() {
    const LoginBtn = document.querySelector(".user-profile-container");
    const profileContent = document.querySelector(".user-profile-content");
    const arrowElement = document.querySelector(".user-profile-arrow");

    const rect = LoginBtn.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const spaceAbove = rect.top;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceLeft = rect.left;
    const spaceRight = viewportWidth - rect.right;

    const isHidden = profileContent.classList.contains("hidden");
    if (spaceBelow < spaceAbove) {
        if (isHidden) {
            profileContent.classList.remove("hidden");
            profileContent.classList.add("open-up");
            arrowElement.classList.add("upDown");
        } else {
            profileContent.classList.add("hidden");
            profileContent.classList.remove("open-up");
            arrowElement.classList.remove("upDown");
        }
    } else {
        if (isHidden) {
            profileContent.classList.remove("hidden");
            profileContent.classList.add("open-down");
            arrowElement.classList.remove("upDown");
        } else {
            profileContent.classList.add("hidden");
            profileContent.classList.remove("open-down");
            arrowElement.classList.add("upDown");
        }
    }

    if (spaceRight < spaceLeft) {
        profileContent.classList.add("open-left");
        profileContent.classList.remove("open-right");
    } else {
        profileContent.classList.add("open-right");
        profileContent.classList.remove("open-left");
    }
}
async function onProcessedLogOut(args) {
    const response = args.response;
    const responseJson = await response.json();
    if (responseJson.errorid == 30) {
        eraseCookie("rkey");
        const urlParams = new URLSearchParams(window.location.search);
        const lid = urlParams.get("lid");
        const lang = document.documentElement.getAttribute("lang");
        let url = "/";
        if (lid === "1" || lang === "fa") {
            url += "?lid=1";
        } else if (lid === "2" || lang === "en") {
            url += "?lid=2";
        } else if (lid === "3" || lang === "ar") {
            url += "?lid=3";
        }
        window.location = `${url}`;
    }
}