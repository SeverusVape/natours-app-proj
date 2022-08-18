import "@babel/polyfill";
import { login, logOut } from "./login";
import { displayMap } from "./mapbox";

const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const logOutBtn = document.querySelector(".nav__el--logout");

if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
}

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        login(email, password);
    });
}

if (logOutBtn) {
    logOutBtn.addEventListener("click", logOut);
}
