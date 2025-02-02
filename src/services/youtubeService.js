// src/services/youtubeService.js
export async function getRelevantVideos(topic) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3//search?part=snippet&maxResults=3&q=${encodeURIComponent(topic)}&type=video&key=${process.env.REACT_APP_YOUTUBE_KEY}`
            
        );
        const data = await response.json();
        console.log("YouTube API response:", data);
        if (!data.items || !Array.isArray(data.items)) {
            console.warn("YouTube API did not return an items array. Response:", data);
            return [];
        }
        return data.items.map(item => ({
            title: item.snippet.title,
            embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`
        }));
    } catch (error) {
        console.error("Error fetching YouTube videos:", error);
        return [];
    }
}
