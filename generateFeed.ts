// generateFeed.ts

const SITE_URL = "https://webtopics.michielvandevelde.ikdoeict.be";
const OUTPUT_FILE = "./feed.xml";
const FEED_SOURCE = "./feed.json";

interface FeedItem {
    title: string;
    link: string;
    description: string;
    author: string;
    category: string;
    pubDate: string;
}

function toRSSDate(date: string): string {
    return new Date(date).toUTCString();
}

async function generateRSS() {
    try {
        const data = await Deno.readTextFile(FEED_SOURCE);
        const items: FeedItem[] = JSON.parse(data);

        const buildDate = new Date().toUTCString();

        const rssItems = items.map((item) => `
    <item>
      <title>${item.title}</title>
      <link>${item.link}</link>
      <description>${item.description}</description>
      <author>${item.author}</author>
      <category>${item.category}</category>
      <pubDate>${toRSSDate(item.pubDate)}</pubDate>
      <guid>${item.link}</guid>
    </item>`).join("\n");

        const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>De Parkwacht - Nieuws en updates</title>
    <link>${SITE_URL}</link>
    <description>Nieuws, updates en aankondigingen van De Parkwacht</description>
    <language>nl</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    ${rssItems}
  </channel>
</rss>`;

        await Deno.writeTextFile(OUTPUT_FILE, rss);
        console.log("RSS feed gegenereerd:", OUTPUT_FILE);
    } catch (error) {
        console.error("Fout bij genereren RSS:", error);
    }
}

generateRSS();
