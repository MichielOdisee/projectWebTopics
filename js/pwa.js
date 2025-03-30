//pwa.js
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/projectWebTopics/service-worker.js").then(() => {
            console.log("✅ Service Worker geregistreerd");
        }).catch(err => {
            console.error("❌ Service Worker registratie mislukt:", err);
        });
    });
}
