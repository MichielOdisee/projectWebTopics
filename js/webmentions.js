class WebMentions extends HTMLElement {
    async connectedCallback() {
        const targetUrl = "https://michielodisee.github.io/projectWebTopics/";
        const apiUrl = `https://webmention.io/api/mentions.jf2?target=${encodeURIComponent(targetUrl)}`;

        this.innerHTML = `<p class="mention-loading">Webmentions laden...</p>`;

        try {
            const res = await fetch(apiUrl);
            const data = await res.json();

            if (!data.children || data.children.length === 0) {
                this.innerHTML = `<p class="mention-empty">Nog geen Webmentions ontvangen.</p>`;
                return;
            }

            const mentionsHTML = data.children.map((mention) => {
                const author = mention.author?.name || "Anoniem";
                const url = mention.url || "#";
                const content = mention.content?.text || "(Geen inhoud)";

                return `
          <div class="mention">
            <p>“${content}”</p>
            <small>– <a href="${url}" target="_blank" rel="noopener noreferrer">${author}</a></small>
          </div>
        `;
            }).join("");

            this.innerHTML = mentionsHTML;

        } catch (err) {
            console.error("Webmentions laden mislukt:", err);
            this.innerHTML = `<p class="mention-error">Webmentions konden niet geladen worden.</p>`;
        }
    }
}

customElements.define("web-mentions", WebMentions);

async function toonMentionURLs() {
    const list = document.getElementById("mention-url-list");
    if (!list) return;

    const targetUrl = "https://michielodisee.github.io/projectWebTopics/";
    const apiUrl = `https://webmention.io/api/mentions.jf2?target=${encodeURIComponent(targetUrl)}`;

    try {
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data.children || data.children.length === 0) {
            list.innerHTML = "<li>Er zijn nog geen vermeldingen gevonden.</li>";
            return;
        }

        const urls = [...new Set(data.children.map(m => m.url).filter(Boolean))];

        list.innerHTML = urls.map(url => `
      <li><a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a></li>
    `).join("");

    } catch (err) {
        console.error("Webmention URLs laden mislukt:", err);
        list.innerHTML = "<li>Fout bij het ophalen van Webmentions.</li>";
    }
}

toonMentionURLs();
