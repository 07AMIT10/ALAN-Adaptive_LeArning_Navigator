// src/components/Modal.jsx
import React, { useState } from 'react';

const Modal = ({ isOpen, onClose, node, onMarkComplete, onMarkRevisit, onExtend }) => {
  if (!isOpen || !node) return null;

  const isLeaf = !node.children || node.children.length === 0;
  const [extending, setExtending] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newOverview, setNewOverview] = useState('');

  const handleExtendSubmit = () => {
    if (!newTitle.trim() || !newOverview.trim()) {
      alert("Please enter both title and overview for the new module.");
      return;
    }
    // Call onExtend with parent id and new child data.
    onExtend(node.id, { title: newTitle, overview: newOverview });
    setExtending(false);
    setNewTitle('');
    setNewOverview('');
    onClose();
  };

  const modalStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  const contentStyles = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '80%',
    maxHeight: '90%',
    overflowY: 'auto',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  };

  return (
    <div style={modalStyles} onClick={onClose}>
      <div style={contentStyles} onClick={(e) => e.stopPropagation()}>
        <h2>{node.title}</h2>
        <p style={{ lineHeight: '1.6' }}>{node.overview}</p>

        <div>
          <h3>Articles</h3>
          <ul>
            {node.articles && node.articles.map((article, index) => (
              <li key={index}>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  {article.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Videos</h3>
          {node.videos && node.videos.map((video, index) => (
            <div key={index} style={{ marginBottom: '15px' }}>
              <h4>{video.title}</h4>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src={video.embedUrl}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={video.title}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%'
                  }}
                ></iframe>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h3>Community Notes</h3>
          <ul>
            {node.communityNotes && node.communityNotes.map((note, index) => (
              <li key={index}>
                <strong>{note.author}:</strong> {note.note}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => onMarkComplete(node.id)}
            style={{
              padding: '10px 20px',
              marginRight: '10px',
              backgroundColor: node.completed ? '#28a745' : '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {node.completed ? 'Completed' : 'Mark as Completed'}
          </button>
          <button
            onClick={() => onMarkRevisit(node.id)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#FF8C00',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Mark to Revisit
          </button>
          {isLeaf && !extending && (
            <button
              onClick={() => setExtending(true)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6a1b9a',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginLeft: '10px'
              }}
            >
              Extend Learning Plan
            </button>
          )}
          {extending && (
            <div style={{ marginTop: '10px' }}>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="New Module Title"
                style={{ padding: '8px', marginRight: '5px' }}
              />
              <input
                type="text"
                value={newOverview}
                onChange={e => setNewOverview(e.target.value)}
                placeholder="New Module Overview"
                style={{ padding: '8px', marginRight: '5px' }}
              />
              <button
                onClick={handleExtendSubmit}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Add Module
              </button>
            </div>
          )}
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginLeft: '10px'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
