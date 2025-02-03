// src/services/articleService.js
const BASE_URL = process.env.REACT_APP_BACKEND_URL || '';

export async function getRelevantArticles(topic) {
  try {
    // Call the Flask backend endpoint for articles
    const response = await fetch(`${BASE_URL}/articles?topic=${encodeURIComponent(topic)}`);
    const data = await response.json();
    if (!data.items || !Array.isArray(data.items)) {
      console.warn("Articles proxy API did not return an items array. Response:", data);
      return [];
    }
    return data.items.map(item => ({
      title: item.title,
      url: item.link,
      snippet: item.snippet
    }));
  } catch (error) {
    console.error("Error fetching articles via Flask proxy:", error);
    return [];
  }
}
