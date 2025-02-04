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
import SavedPlans from './SavedPlans';
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
  const [savedPlans, setSavedPlans] = useState([]);

  // Load saved plans on mount
  React.useEffect(() => {
    const plans = localStorage.getItem('savedRoadmaps');
    if (plans) {
      setSavedPlans(JSON.parse(plans));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const dynamicData = await generateDynamicRoadmap(topic, experience);
    
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

  // New function to handle extending a learning plan.
  const handleExtend = (parentId, newChild) => {
    // Generate a unique id for the new child (using timestamp)
    const newId = parentId + '-' + Date.now();
    // Create the new child node object.
    const childNode = {
      ...newChild,
      id: newId,
      articles: [],
      videos: [],
      communityNotes: [],
      completed: false,
      children: []
    };

    // Update parent node: add new child's id to parent's children array.
    setNodes(nds => nds.map(node => {
      if (node.id === parentId) {
        // Also update the underlying details.
        const details = { ...node.data.details };
        details.children = details.children ? [...details.children, newId] : [newId];
        node.data.details = details;
      }
      return node;
    }));

    // Add the new child node to React Flow state.
    const newNode = {
      id: newId,
      data: { label: childNode.title, details: childNode },
      position: { x: 0, y: 0 },  // Will be repositioned via layout
      style: {
        border: '2px solid #333',
        padding: '10px',
        borderRadius: '10px',
        backgroundColor: '#ffffa5',
        width: nodeWidth,
        textAlign: 'center'
      }
    };
    setNodes(nds => [...nds, newNode]);

    // Add new edge from parent to the new child.
    const newEdge = {
      id: `e${parentId}-${newId}`,
      source: parentId,
      target: newId,
      animated: false,
      markerEnd: { type: 'arrowclosed', color: '#007bff' },
      style: { stroke: '#007bff', strokeWidth: 2 }
    };
    setEdges(eds => [...eds, newEdge]);

    // Re-run layout if desired (optional).
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements([...nodes, newNode], [...edges, newEdge], 'TB');
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    alert("Learning plan extended successfully!");
  };

  const saveRoadmap = () => {
    const roadmapData = { nodes, edges, topic, experience };
    const updatedPlans = [...savedPlans, roadmapData];
    localStorage.setItem('savedRoadmaps', JSON.stringify(updatedPlans));
    setSavedPlans(updatedPlans);
    alert("Roadmap saved successfully!");
  };

  if (!submitted) {
    return (
      <div className="app-container form-container">
        <h1>Welcome Amit!</h1>
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
              <option value="Heard of it">Heard of it</option>
              <option value="Know about it">Know about it</option>
              <option value="Worked with it">Worked with it</option>
            </select>
          </div>
          <button type="submit" className="submit-btn">Generate Roadmap</button>
        </form>
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Building your Personalized Learning Plan...</p>
          </div>
        )}
        <SavedPlans plans={savedPlans} onSelectPlan={(plan) => {
          setNodes(plan.nodes);
          setEdges(plan.edges);
          setTopic(plan.topic);
          setExperience(plan.experience);
          setSubmitted(true);
        }} />
      </div>
    );
  }

  return (
    <div style={{ height: '100vh' }}>
      <header className="roadmap-header">
        <div>
          <h1>{topic}</h1>
          <p>Experience Level: {experience}</p>
        </div>
        <div>
          <button onClick={saveRoadmap} className="save-btn">Save Roadmap</button>
          <button onClick={() => window.location.reload()} className="new-btn">Create New Roadmap</button>
        </div>
      </header>
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
          onExtend={handleExtend}  // Pass the extend callback to Modal
        />
      )}
    </div>
  );
}

export default App;
