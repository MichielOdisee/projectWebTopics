if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/projectWebTopics/service-worker.js')
            .then(reg => console.log("✅ Service worker geregistreerd:", reg))
            .catch(err => console.error("❌ Fout bij registratie:", err));
    });
}
