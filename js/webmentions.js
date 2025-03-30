class WebMentions extends HTMLElement {
    async connectedCallback() {
        const targetUrl = "https://michielodisee.github.io/projectWebTopics/";
        const apiUrl = `https://webmention.io/api/mentions.jf2?target=${encodeURIComponent(targetUrl)}`;

        this.innerHTML = '<p>Webmentions laden...</p>';

        try {
            const res = await fetch(apiUrl);
            const data = await res.json();

            if (!data.children || data.children.length === 0) {
                this.innerHTML = '<p>Nog geen Webmentions ontvangen.</p>';
                return;
            }

            this.innerHTML = data.children.map(mention => {
                const author = mention.author?.name || 'Anoniem';
                const content = mention.content?.text || '(Geen inhoud)';
                const url = mention.url || '#';

                return `
          <div class="mention">
            <p>“${content}”</p>
            <small>– <a href="${url}" target="_blank" rel="noopener noreferrer">${author}</a></small>
          </div>
        `;
            }).join('');
        } catch (err) {
            console.error(err);
            this.innerHTML = '<p>Webmentions konden niet geladen worden.</p>';
        }
    }
}

customElements.define('web-mentions', WebMentions);
