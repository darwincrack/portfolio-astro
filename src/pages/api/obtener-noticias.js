export const prerender = false;

/** @type {import('astro').APIRoute} */
export const GET = async ({ request }) => {
    const apiKey = import.meta.env.GNEWS_API_KEY;
    if (!apiKey) {
        return new Response(JSON.stringify({ error: "GNews API key no encontrada." }), { status: 500 });
    }

    const url = `https://gnews.io/api/v4/top-headlines?category=technology&lang=es&country=en&max=10&apikey=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error de la API de GNews: ${response.statusText}`);
        }
        const data = await response.json();

        // Devolvemos solo 3 artículos para la selección
        const articles = data.articles.slice(0, 9).map(article => ({
            title: article.title,
            description: article.description,
            url: article.url,
            image: article.image,
            content: article.content, // Pasamos el contenido para reescribirlo después
        }));

        return new Response(JSON.stringify(articles), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        console.error("Error al obtener noticias de GNews:", error);
        return new Response(JSON.stringify({ error: "No se pudieron obtener las noticias." }), { status: 500 });
    }
}; 