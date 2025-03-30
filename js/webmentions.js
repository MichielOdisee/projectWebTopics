class WebMentions extends HTMLElement {
    connectedCallback() {
        this.innerHTML = '<p>Webmentions laden...</p>';

        fetch('webmentions.json')
            .then(res => {
                if (!res.ok) throw new Error("Kan webmentions.json niet laden");
                return res.json();
            })
            .then(data => {
                if (!Array.isArray(data)) throw new Error("Data is geen array");

                this.innerHTML = data.map(mention => `
                    <div class="mention">
                        <p>${mention.content}</p>
                        <small>- ${mention.author}</small><br />
                        <time datetime="${mention.timestamp}">${new Date(mention.timestamp).toLocaleString()}</time>
                    </div>
                `).join('');
            })
            .catch(error => {
                console.error(error);
                this.innerHTML = '<p>Webmentions konden niet geladen worden.</p>';
            });
    }
}

customElements.define('web-mentions', WebMentions);

const wmForm = document.getElementById("webmention-form");
const wmStatus = document.getElementById("wm-status");

wmForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(wmForm));

    wmStatus.textContent = "Webmention wordt (lokaal) verwerkt...";

    // Simuleer succesvolle post
    setTimeout(() => {
        wmStatus.textContent = "Je webmention werd lokaal opgeslagen (niet echt verzonden).";
        wmForm.reset();
    }, 1000);

});
