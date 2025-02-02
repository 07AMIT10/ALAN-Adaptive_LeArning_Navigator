// src/utils/roadmapGenerator.js
import { generateRoadmapNode } from "../services/aiService";
import { getRelevantVideos } from "../services/youtubeService";
import { getRelevantArticles } from "../services/articleService";

/**
 * Parses the AI response.
 * Expects a structure like: { "roadmapData": { "nodes": [ ... ] } }
 */
function parseAIResponse(aiResponse) {
    if (!aiResponse || !aiResponse.roadmapData || !aiResponse.roadmapData.nodes) {
        console.error("Invalid AI response structure:", aiResponse);
        return [];
    }
    return aiResponse.roadmapData.nodes;
}

/**
 * Generates the dynamic roadmap for a given topic and experience level.
 */
export async function generateDynamicRoadmap(mainTopic, experienceLevel) {
    const aiResponse = await generateRoadmapNode(mainTopic, experienceLevel);
    const parsedNodes = parseAIResponse(aiResponse);

    // Enhance each node with videos and articles.
    const enhancedNodes = await Promise.all(parsedNodes.map(async node => {
        const [videos, articles] = await Promise.all([
            getRelevantVideos(node.title),
            getRelevantArticles(node.title)
        ]);
        node.videos = videos;
        node.articles = articles;
        return node;
    }));

    // Generate edges for every node that has children.
    const edges = [];
    enhancedNodes.forEach(node => {
        if (node.children && Array.isArray(node.children)) {
            node.children.forEach(childId => {
                // Only add the edge if the child exists in our enhancedNodes.
                if (enhancedNodes.find(n => n.id === childId)) {
                    edges.push({
                        id: `e${node.id}-${childId}`,
                        source: node.id,
                        target: childId,
                        animated: false,
                        markerEnd: { type: 'arrowclosed', color: '#007bff' },
                        style: { stroke: '#007bff', strokeWidth: 2 }
                    });
                }
            });
        }
    });

    return { nodes: enhancedNodes, edges };
}
