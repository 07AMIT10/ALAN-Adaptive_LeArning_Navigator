// api/youtube.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { topic } = req.query;
  if (!topic) {
    res.status(400).json({ error: 'Missing topic query parameter' });
    return;
  }
  
  const apiKey = process.env.REACT_APP_YOUTUBE_KEY;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=${encodeURIComponent(topic)}&type=video&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    // Add CORS header
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching YouTube data' });
  }
};
