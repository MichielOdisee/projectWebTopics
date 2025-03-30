class WebMentions extends HTMLElement {
    async connectedCallback() {
        const targetUrl = "https://michielodisee.github.io/projectWebTopics/";
        const apiUrl = `https://webmention.io/api/mentions.jf2?target=${encodeURIComponent(targetUrl)}`;

        this.innerHTML = `<p class="mention-loading">Webmentions laden...</p>`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (!data.children || data.children.length === 0) {
                this.innerHTML = `<p class="mention-empty">Nog geen Webmentions ontvangen.</p>`;
                return;
            }

            const mentionsHTML = data.children.map((mention) => {
                const authorName = mention.author?.name || "Anoniem";
                const authorUrl = mention.author?.url || "#";
                const content = mention.content?.text || "(Geen inhoud)";
                const mentionUrl = mention.url || authorUrl;

                return `
          <div class="mention">
            <p class="mention-content">“${content}”</p>
            <small class="mention-author">
              – <a href="${mentionUrl}" target="_blank" rel="noopener noreferrer">${authorName}</a>
            </small>
          </div>
        `;
            }).join("");

            this.innerHTML = mentionsHTML;

        } catch (error) {
            console.error("Fout bij laden van webmentions:", error);
            this.innerHTML = `<p class="mention-error">Webmentions konden niet geladen worden.</p>`;
        }
    }
}

customElements.define('web-mentions', WebMentions);
