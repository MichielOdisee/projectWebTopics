// main.js

import './webmentions.js';


if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./js/pwa.js')
        .then(() => console.log('Service Worker geregistreerd'))
        .catch(err => console.error('Fout bij registratie Service Worker:', err));
}


const worker = new Worker('./js/webworker.js');
worker.postMessage({ actie: 'start', bericht: 'Welkom bij De Parkwacht' });

worker.onmessage = e => {
    console.log('Reactie Web Worker:', e.data);


    const msg = document.createElement('div');
    msg.textContent = e.data;
    msg.style.fontStyle = 'italic';
    msg.style.marginTop = '1rem';
    document.body.appendChild(msg);
};

window.addEventListener('pagehide', () => worker.terminate());


const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("main-menu");

hamburger?.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", isOpen);
});


const toggle = document.getElementById("darkmode-toggle");

function updateDarkToggleIcon() {
    const isDark = document.documentElement.classList.contains("dark");
    toggle.textContent = isDark ? "☀️" : "🌙";
    toggle.setAttribute("aria-label", isDark ? "Lichte modus" : "Donkere modus");
}

toggle?.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    updateDarkToggleIcon();
});

updateDarkToggleIcon();
