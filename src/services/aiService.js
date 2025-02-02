// src/services/aiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini client using your API key.
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_KEY);

/**
 * Generates a roadmap node using Gemini.
 * The prompt asks for a brief overview, three child sub-topics, and key learning objectives.
 */
export async function generateRoadmapNode(topic, experience) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `You are an expert curriculum designer specializing in creating learning roadmaps for technical topics. Your goal is to generate a JSON output that defines the structured learning path for a given topic. You will generate the core structure of the roadmap, focusing on the topic flow and descriptive content. Crucially, you will NOT include any suggestions for articles or videos. The \`articles\` and \`videos\` arrays in your JSON output MUST be empty. These will be populated from external services later.

Input:

You will receive two primary inputs:
Input:

Topic: ${topic}
Experience Level: ${experience}

1.  Topic:${topic} The subject area for the learning roadmap (e.g., "System Design", "Cloud Computing", "Frontend Development with React", "Data Science Fundamentals", "Cybersecurity Basics").
2.  Experience Level: The user's self-assessed experience level with the given topic. This will be one of the following categories:
    *   "Heard of it": The user has a very basic awareness of the topic, perhaps just the name. The roadmap should be very introductory, starting from the absolute fundamentals.
    *   "Know about it": The user has some foundational knowledge of the topic and understands basic concepts. The roadmap should build upon these foundations, covering core principles and intermediate concepts.
    *   "Worked with it": The user has practical experience with the topic and wants to deepen their understanding or explore advanced areas. The roadmap should focus on advanced techniques, best practices, and potentially niche or specialized sub-topics.

Output:

Your output MUST be a single, valid JSON object. This JSON object should have a single top-level key named "roadmapData". The value of "roadmapData" should be another JSON object with a single key named "nodes". The value of "nodes" should be a JSON array.

Each element in the "nodes" array represents a learning module or topic within the roadmap and MUST be a JSON object with the following keys:

*   \`id\`:  A unique string identifier for the node (e.g., "1", "2", "3", etc.).  Ensure IDs are sequential strings and do not repeat.
*   \`title\`: A concise and descriptive string title for the learning module (e.g., "Introduction to GenAI", "Deep Learning Basics", "Ethical Considerations in GenAI"). The title should be appropriate for the given topic and experience level.
*   \`overview\`: A detailed paragraph (3-5 sentences) providing an overview of the module. This should:
    *   Familiarize the user with the topic of the module.
    *   Explain what the module is about in detail, using examples, analogies, or relatable scenarios where possible to enhance understanding.
    *   Highlight the importance of this module in the overall learning path.
    *   Be tailored to the specified experience level. For "Heard of it," keep it very simple and high-level. For "Worked with it," it can be more technical and assume some prior knowledge.
*   \`articles\`: An **EMPTY JSON ARRAY** \`[]\`.  This MUST be an empty array.
*   \`videos\`: An **EMPTY JSON ARRAY** \`[]\`. This MUST be an empty array.
*   \`communityNotes\`: A JSON array of JSON objects, each representing a simulated community note or tip related to the module. Each object should have:
    *   \`author\`: A fictional name of the author (string, e.g., "Lana", "Alex", "Sam").
    *   \`note\`: A short, helpful note or tip related to the module content (string).  These notes should provide practical advice, highlight key takeaways, or encourage further exploration. Provide 2-3 community notes per module.
*   \`completed\`: A JSON boolean value, always set to \`false\`.
*   \`children\`: A JSON array of strings, where each string is the \`id\` of a child node. This defines the flow and hierarchy of the roadmap. Consider logical dependencies between topics when defining children. For introductory modules, there might be multiple children, branching out to different sub-topics. For later modules, there might be fewer or no children, indicating the end of a learning path or a point where the user can branch out independently.

Content Guidance based on Experience Level:

*   "Heard of it":
    *   Overview: Focus on very basic definitions, analogies, and real-world relevance. Avoid jargon.
    *   Community Notes: Simple, encouraging tips like "Start with the basics first!", "Don't be afraid to ask questions!".
*   "Know about it":
    *   Overview: Explain core concepts in more detail, introduce key terminology, and discuss foundational principles.
    *   Community Notes: More specific tips like "Pay attention to X concept, it's fundamental", "Try building a small project to practice this".
*   "Worked with it":
    *   Overview: Focus on advanced techniques, best practices, performance considerations, and emerging trends. Assume the user understands the basics.
    *   Community Notes: Advanced tips like "Consider using framework Y for better performance", "Explore the latest research in area Z", "Think about scalability implications".

Example JSON Output Format (for reference - do not directly copy this content, generate new content based on topic and experience level):

\`\`\`json
{
  "roadmapData": {
    "nodes": [
      {
        "id": "1",
        "title": "Introduction to [Topic Name]",
        "overview": "...",
        "articles": [],
        "videos": [],
        "communityNotes": [ /* ... */ ],
        "completed": false,
        "children": ["2", "3"]
      },
      {
        "id": "2",
        "title": "[Topic Name] Core Concept 1",
        "overview": "...",
        "articles": [],
        "videos": [],
        "communityNotes": [ /* ... */ ],
        "completed": false,
        "children": ["4", "5", "6"]
      }
      // ... more nodes as needed
    ]
  }
}
\`\`\`

Instructions for Generation:

1.  Topic for Roadmap: [Specify Topic Here]
2.  Experience Level: [Specify Experience Level Here]
3.  Number of Modules (Nodes): Aim for a roadmap with comprehensive and detailed learning path. Adjust this number based on the complexity of the topic and experience level(SHOULD BE ATLEAST 10 NODES... ON AN AVERAGE HAVE ATLEAST 10 NODES){HAVING MULTIPLE CHILDREN NODES WITH A SINGLE PARENT IS APPRECIATED, INPLACE OF MULTIPLE PARENT NODE HAVING A SINGLE CHILD ONLY}.
4.  Logical Flow: Ensure the modules are logically sequenced to build upon each other. Start with foundational concepts and progress to more advanced topics. Use the \`children\` property to represent this flow.
5.  Community Note Helpfulness: Make sure the community notes are practical and genuinely helpful tips for someone learning the module topic.
6.  JSON Output ONLY: Your entire response MUST be a single, valid JSON object as described above. Do not include any introductory text, explanations, or code comments outside of the JSON structure itself. Only output the JSON.

Generate the JSON output now, keeping all these instructions in mind, and absolutely ensure that the \`articles\` and \`videos\` arrays are empty \`[]\`.`;

    //     const result = await model.generateContent(prompt);
    //     // You need to parse the JSON from the Gemini output.
    //     console.log("Gemini response:", result.response.text());
    //     try {
    //         return JSON.parse(result.response.text());
    //     } catch (error) {
    //         console.error("Error parsing Gemini response:", error);
    //         return null;
    //     }
    // }


    const result = await model.generateContent(prompt);

    // Extract the response text.
    let responseText = "";
    if (
        result.response &&
        result.response.candidates &&
        result.response.candidates.length > 0 &&
        result.response.candidates[0].content &&
        result.response.candidates[0].content.parts &&
        result.response.candidates[0].content.parts.length > 0
    ) {
        responseText = result.response.candidates[0].content.parts[0].text;
    } else if (typeof result.response.text === "string") {
        responseText = result.response.text;
    } else {
        console.error("No valid text found in Gemini response:", result.response);
        return null;
    }

    // Ensure responseText is a string.
    if (typeof responseText !== "string") {
        console.error("Expected a string response, got:", responseText);
        return null;
    }

    responseText = responseText.trim();

    // Remove Markdown code block markers if present.
    if (responseText.startsWith("```json")) {
        responseText = responseText.substring(7);
    }
    if (responseText.endsWith("```")) {
        responseText = responseText.substring(0, responseText.length - 3);
    }

    try {
        const parsed = JSON.parse(responseText);
        return parsed;
    } catch (error) {
        console.error("Error parsing Gemini response:", error);
        console.error("Response text:", responseText);
        return null;
    }
}
