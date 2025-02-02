// src/services/articleService.js
export async function getRelevantArticles(topic) {
    // const api = AIzaSyAz3C - Mxg93IRCLL - B1VGAkqbuGFF5kTq8
    // const c = 250652494c48b4c6b
    try {
        const response = await fetch(
            // `https://www.googleapis.com/customsearch/v1?key=${process.env.REACT_APP_SEARCH_KEY}&cx=${process.env.REACT_APP_CSE_ID}&q=${encodeURIComponent(topic)}&num=3`
            `https://www.googleapis.com/customsearch/v1?key=AIzaSyAz3C-Mxg93IRCLL-B1VGAkqbuGFF5kTq8&cx=250652494c48b4c6b&q=${encodeURIComponent(topic)}&num=3`
        );
        const data = await response.json();
        console.log("Article API response:", data);
        if (!data.items || !Array.isArray(data.items)) {
            console.warn("Article API did not return an items array. Response:", data);
            return [];
        }
        return data.items.map(item => ({
            title: item.title,
            url: item.link,
            snippet: item.snippet
        }));
    } catch (error) {
        console.error("Error fetching articles:", error);
        return [];
    }
}
