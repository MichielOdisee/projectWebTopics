import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const WEBMENTIONS_PATH = "./webmentions.json";
const TARGET_URL = "https://webtopics.michielvandevelde.ikdoeict.be"

// 1. Hulp: webmentions ophalen
async function getWebmentions(): Promise<any[]> {
    try {
        const data = await Deno.readTextFile(WEBMENTIONS_PATH);
        return JSON.parse(data);
    } catch {
        return [];
    }
}

// 2. Hulp: webmention opslaan
async function saveWebmention(newMention: any) {
    const mentions = await getWebmentions();
    mentions.push(newMention);
    await Deno.writeTextFile(WEBMENTIONS_PATH, JSON.stringify(mentions, null, 2));
}

// 3. Hulp: statische bestanden serveren
async function serveStatic(pathname: string): Promise<Response> {
    try {
        const filePath = pathname === "/" ? "/index.html" : pathname;
        const file = await Deno.readFile(`.${filePath}`);
        const contentType = getContentType(filePath);
        return new Response(file, { headers: { "Content-Type": contentType } });
    } catch {
        return new Response("Bestand niet gevonden", { status: 404 });
    }
}

function getContentType(path: string): string {
    if (path.endsWith(".html")) return "text/html";
    if (path.endsWith(".css")) return "text/css";
    if (path.endsWith(".js")) return "application/javascript";
    if (path.endsWith(".json")) return "application/json";
    if (path.endsWith(".xml")) return "application/xml";
    if (path.endsWith(".png")) return "image/png";
    if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
    if (path.endsWith(".svg")) return "image/svg+xml";
    return "text/plain";
}


async function isValidWebmention(source: string, target: string): Promise<boolean> {
    try {
        const res = await fetch(source);
        const html = await res.text();
        return html.includes(target);
    } catch {
        return false;
    }
}

// 5. Server
serve(async (req: Request): Promise<Response> => {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // ✅ API: ophalen
    if (req.method === "GET" && pathname === "/api/webmentions") {
        const mentions = await getWebmentions();
        return new Response(JSON.stringify(mentions), {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        });
    }

    // ✅ API: ontvangen
    if (req.method === "POST" && pathname === "/api/webmentions") {
        try {
            const mention = await req.json();
            const { author, content, source, target } = mention;

            if (!author || !content || !source || !target) {
                throw new Error("Webmention moet 'author', 'content', 'source' en 'target' bevatten");
            }

            // 🔒 Spamfilter: controleer of bron target bevat
            const isValid = await isValidWebmention(source, target);
            if (!isValid) {
                throw new Error("De bronpagina linkt niet naar deze website");
            }

            const newMention = {
                author,
                content,
                source,
                target,
                timestamp: new Date().toISOString(),
            };

            await saveWebmention(newMention);

            // 🔔 Notificatie (log naar console, eventueel webhook)
            console.log(`📩 Nieuwe webmention van ${author} (${source})`);

            return new Response(JSON.stringify({ status: "Webmention ontvangen" }), {
                status: 201,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            });

        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Onbekende fout";
            return new Response(JSON.stringify({ error: message }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            });
        }
    }


    return serveStatic(pathname);
});
