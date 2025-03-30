const SITE_URL = "https://michielodisee.github.io/projectWebTopics/";
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
    const d = new Date(date);
    return d.toUTCString(); // "Sun, 30 Mar 2025 08:00:00 GMT"
}

function escapeXML(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

async function generateRSS() {
    try {
        const data = await Deno.readTextFile(FEED_SOURCE);
        const items: FeedItem[] = JSON.parse(data);

        const buildDate = new Date().toUTCString();

        const rssItems = items.map((item) => `
    <item>
      <title>${escapeXML(item.title)}</title>
      <link>${item.link}</link>
      <description>${escapeXML(item.description)}</description>
      <author>${escapeXML(item.author)}</author>
      <category>${escapeXML(item.category)}</category>
      <pubDate>${toRSSDate(item.pubDate)}</pubDate>
      <guid>${item.link}</guid>
    </item>`).join("\n");

        const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>De Parkwacht - Nieuws en updates</title>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}feed.xml" rel="self" type="application/rss+xml" />
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
