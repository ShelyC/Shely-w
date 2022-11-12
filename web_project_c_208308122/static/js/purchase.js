function showPositionTracker(shouldShow) {
    const btn = document.getElementById('location-btn');
    if (shouldShow) {
        btn.hidden = false;
    } else {
        btn.hidden = true;
    }
}

function getLocation() {
    if (navigator.geolocation) {
        showLoader(true);
        navigator.geolocation.getCurrentPosition(successCallback, showLocationError);
    } else {
        showLocationError();
    }
    return false;
}

//change the css- show/hide loader
function showLoader(shouldShow) {
    const loader = document.getElementById('loader');
    if (shouldShow) {
        loader.style.display = 'flex';
    } else {
        loader.style.display = 'none';
    }
}

function showLocationError() {
    alert("There is no option to find your location.");
    showLoader(false);
}

function successCallback(location) {
    const address = document.getElementById('address');
    address.value = `long: ${location.coords.longitude}, lat ${location.coords.latitude}`;
    showLoader(false);
}