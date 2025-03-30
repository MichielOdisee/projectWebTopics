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

async function laadNieuws() {
    try {
        const res = await fetch("feed.json");
        const items = await res.json();

        const lijst = document.getElementById("nieuws-lijst");

        items.forEach(item => {
            const datum = new Date(item.pubDate).toLocaleDateString("nl-BE", {
                year: 'numeric', month: 'long', day: 'numeric'
            });

            const nieuwsItem = document.createElement("li");
            nieuwsItem.innerHTML = `
        <h3>${item.title}</h3>
        <p><em>${datum} – ${item.author}</em></p>
        <p>${item.description}</p>
        <a href="${item.link}" class="cta">Lees meer</a>
      `;
            lijst.appendChild(nieuwsItem);
        });

    } catch (err) {
        console.error("Nieuws laden mislukt:", err);
    }
}

laadNieuws();
