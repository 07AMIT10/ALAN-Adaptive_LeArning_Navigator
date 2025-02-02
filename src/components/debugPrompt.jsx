// src/components/DebugPrompt.jsx
import React, { useState } from 'react';
import { generateRoadmapNode } from '../services/aiService';

const DebugPrompt = () => {
    const [topic, setTopic] = useState('');
    const [experience, setExperience] = useState('Heard of it');
    const [output, setOutput] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const response = await generateRoadmapNode(topic, experience);
        setOutput(response);
        setLoading(false);
        console.log("Gemini Output:", response);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Debug Gemini Roadmap Generation</h1>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ marginRight: '10px' }}>Topic:</label>
                    <input
                        type="text"
                        value={topic}
                        onChange={e => setTopic(e.target.value)}
                        placeholder="Enter topic here"
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ marginRight: '10px' }}>Experience Level:</label>
                    <select value={experience} onChange={e => setExperience(e.target.value)}>
                        <option value="Heard of it">Heard of it</option>
                        <option value="Know about it">Know about it</option>
                        <option value="Worked with it">Worked with it</option>
                    </select>
                </div>
                <button type="submit">Generate Roadmap</button>
            </form>
            {loading ? <p>Loading...</p> : null}
            <h2>Gemini Response Output:</h2>
            <pre style={{ background: '#f4f4f4', padding: '10px' }}>
                {output ? JSON.stringify(output, null, 2) : "No output yet."}
            </pre>
        </div>
    );
};

export default DebugPrompt;
