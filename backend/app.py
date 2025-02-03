from flask import Flask, request, jsonify
import os
import requests
from dotenv import load_dotenv
from flask_cors import CORS

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # This enables CORS for all domains; adjust as needed

YOUTUBE_KEY = os.getenv("YOUTUBE_KEY")
SEARCH_KEY = os.getenv("SEARCH_KEY")
CSE_ID = os.getenv("CSE_ID")

@app.route('/youtube', methods=['GET'])
def youtube_proxy():
    topic = request.args.get('topic')
    if not topic:
        return jsonify({"error": "Missing topic query parameter"}), 400
    
    youtube_url = (
        f"https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3"
        f"&q={requests.utils.quote(topic)}&type=video&key={YOUTUBE_KEY}"
    )
    try:
        resp = requests.get(youtube_url)
        data = resp.json()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": "Error fetching YouTube data", "details": str(e)}), 500

@app.route('/articles', methods=['GET'])
def articles_proxy():
    topic = request.args.get('topic')
    if not topic:
        return jsonify({"error": "Missing topic query parameter"}), 400

    search_url = (
        f"https://www.googleapis.com/customsearch/v1?key={SEARCH_KEY}&cx={CSE_ID}"
        f"&q={requests.utils.quote(topic)}&num=3"
    )
    try:
        resp = requests.get(search_url)
        data = resp.json()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": "Error fetching articles", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
