// src/components/App.jsx
import React, { useState, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Background,
  Controls
} from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';
import { generateDynamicRoadmap } from '../utils/roadmapGenerator';
import Modal from './Modal';
import '../App.css';

const nodeWidth = 200;
const nodeHeight = 60;
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2
    };
    return node;
  });

  return { nodes: layoutedNodes, edges };
};

function App() {
  // State for user inputs.
  const [topic, setTopic] = useState('');
  const [experience, setExperience] = useState('Heard of it');
  const [submitted, setSubmitted] = useState(false);

  // React Flow state.
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Handle form submission.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const dynamicData = await generateDynamicRoadmap(topic, experience);
    
    // Build React Flow nodes from all enhanced nodes.
    const rfNodes = dynamicData.nodes.map(node => ({
      id: node.id,
      data: { label: node.title, details: node },
      position: { x: 0, y: 0 },
      style: {
        border: '2px solid #333',
        padding: '10px',
        borderRadius: '10px',
        backgroundColor: node.completed ? '#a0e6a0' : '#ffffa5',
        width: nodeWidth,
        textAlign: 'center'
      }
    }));
    
    const rfEdges = dynamicData.edges;
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(rfNodes, rfEdges, 'TB');
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    setLoading(false);
    setSubmitted(true);
  };

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node.data.details);
    setModalOpen(true);
  }, []);

  const onModalClose = () => {
    setModalOpen(false);
  };

  const markNodeCompleted = (nodeId) => {
    setNodes(nds =>
      nds.map(node => {
        if (node.id === nodeId) {
          node.style = { ...node.style, backgroundColor: '#a0e6a0' };
        }
        return node;
      })
    );
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode({ ...selectedNode, completed: true });
    }
  };

  // Updated revisit handler: set node background to dark orange.
  const markNodeRevisit = (nodeId) => {
    setNodes(nds =>
      nds.map(node => {
        if (node.id === nodeId) {
          node.style = { ...node.style, backgroundColor: '#FF8C00' };
        }
        return node;
      })
    );
  };

  // If user has not yet submitted, show the enhanced input form.
  if (!submitted) {
    return (
      <div className="app-container form-container">
        <h1>Welcome Learner!</h1>
        <h2>What shall we learn today?</h2>
        <form onSubmit={handleSubmit} className="input-form">
          <div className="form-group">
            <label>Topic:</label>
            <input 
              type="text" 
              value={topic} 
              onChange={e => setTopic(e.target.value)} 
              placeholder="Enter topic here" 
              required
            />
          </div>
          <div className="form-group">
            <label>Experience Level:</label>
            <select value={experience} onChange={e => setExperience(e.target.value)}>
              <option value="Heard of it">Just Heard of it</option>
              <option value="Know about it">Know about it</option>
              <option value="Worked with it">Worked with it</option>
            </select>
          </div>
          <button type="submit" className="submit-btn">Generate Learning Plan</button>
        </form>
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Building your Personalized Learning Plan...</p>
          </div>
        )}
      </div>
    );
  }

  // Otherwise, render the roadmap using React Flow.
  return (
    <div style={{ height: '100vh' }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
          style={{ background: '#f0f0f0' }}
        >
          <Background color="#aaa" gap={16} />
          <Controls />
        </ReactFlow>
      </ReactFlowProvider>
      {modalOpen && selectedNode && (
        <Modal
          isOpen={modalOpen}
          onClose={onModalClose}
          node={selectedNode}
          onMarkComplete={markNodeCompleted}
          onMarkRevisit={markNodeRevisit}
        />
      )}
    </div>
  );
}

export default App;
