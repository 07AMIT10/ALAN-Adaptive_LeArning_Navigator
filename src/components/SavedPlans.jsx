// src/components/SavedPlans.jsx
import React from 'react';

const SavedPlans = ({ plans, onSelectPlan }) => {
  if (!plans || plans.length === 0) return null;

  return (
    <div className="saved-plans">
      <h3>Saved Roadmaps</h3>
      <ul>
        {plans.map((plan, index) => (
          <li key={index}>
            <button onClick={() => onSelectPlan(plan)}>
              {plan.topic} ({plan.experience})
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedPlans;
