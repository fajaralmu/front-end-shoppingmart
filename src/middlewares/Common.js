
export const commonAuthorizedHeader = () => {
    return {
        'Content-Type': 'application/json',
        'requestId': getRequestId(),//'localStorage.getItem("requestId")',
        'loginKey': getLoginKey()
    }
};

export const getLoginKey = () => {
    return getCookie('loginKey');
}

export const getRequestId = () => {
    return getCookie("requestId");// document.getElementById("requestId").value;
}

export const setCookie = function (cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
export const getCookie = function (cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}