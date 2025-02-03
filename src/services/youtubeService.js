// src/services/youtubeService.js

const BASE_URL = process.env.REACT_APP_BACKEND_URL || '';
export async function getRelevantVideos(topic) {
  try {
    // Call the Flask backend endpoint (adjust BASE_URL if needed)
    const response = await fetch(
      `${BASE_URL}/youtube?topic=${encodeURIComponent(topic)}`
    );
    const data = await response.json();
    if (!data.items || !Array.isArray(data.items)) {
      console.warn("YouTube proxy API did not return an items array. Response:", data);
      return [];
    }
    return data.items.map(item => ({
      title: item.snippet.title,
      embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`
    }));
  } catch (error) {
    console.error("Error fetching YouTube videos via Flask proxy:", error);
    return [];
  }
}
