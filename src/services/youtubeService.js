// src/services/youtubeService.js
export async function getRelevantVideos(topic) {
  try {
    // Call the proxy endpoint provided in the "api" folder
    const response = await fetch(
      `/api/youtube?topic=${encodeURIComponent(topic)}`
    );
    const data = await response.json();
    if (!data.items || !Array.isArray(data.items)) {
      console.warn("Proxy YouTube API did not return an items array. Response:", data);
      return [];
    }
    return data.items.map(item => ({
      title: item.snippet.title,
      embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`
    }));
  } catch (error) {
    console.error("Error fetching YouTube videos via proxy:", error);
    return [];
  }
}
