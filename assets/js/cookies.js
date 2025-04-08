//cookies.js
function createCustomCookies(cookiesData, prefix = '', forceUpdate = false) {
    if (!cookiesData || typeof cookiesData !== 'object') {
        console.error('Cookie data must be provided as an object');
        return;
    }

    const maxAge = 2 * 365 * 24 * 60 * 60;
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 2);

    const cookieParams = [
        `path=/`,
        `expires=${expirationDate.toUTCString()}`,
        `max-age=${maxAge}`,
        "SameSite=Lax"
    ];

    if (window.location.protocol === "https:") {
        cookieParams.push("Secure");
    }

    Object.keys(cookiesData).forEach(cookieName => {
        const fullCookieName = prefix ? `${prefix}_${cookieName}` : cookieName;

        if (forceUpdate || !getCookie(fullCookieName)) {
            document.cookie = `${fullCookieName}=${cookiesData[cookieName]}; ${cookieParams.join('; ')}`;
        }
    });
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return decodeURIComponent(parts.pop().split(';').shift());
    }
    return null;
}

function deleteCookie(name, prefix = '') {
    const fullCookieName = prefix ? `${prefix}_${name}` : name;
    document.cookie = `${fullCookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
}


function getAllCookies(prefix = '') {
    const cookies = {};
    document.cookie.split(';').forEach(cookie => {
        if (cookie.trim()) {
            const [name, value] = cookie.trim().split('=');
            if (!prefix || name.startsWith(prefix)) {
                cookies[name] = decodeURIComponent(value);
            }
        }
    });
    return cookies;
}
