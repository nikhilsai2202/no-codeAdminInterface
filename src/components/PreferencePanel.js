import React from 'react';
import { useDrag } from 'react-dnd';
import { FaEnvelope, FaSms, FaBell } from 'react-icons/fa';
import './PreferencePanel.css';

const DraggablePreference = ({ type, label, icon }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'formItem',
    item: { 
      id: `preference-${type}-${Date.now()}`,
      label, 
      type: 'preference',
      preferenceType: type 
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`preference-item ${isDragging ? 'dragging' : ''}`}
      title={`Drag to add ${label}`}
    >
      <div className="preference-icon">{icon}</div>
      <span className="preference-label">{label}</span>
      <div className="drag-indicator">⋮⋮</div>
    </div>
  );
};

const PreferencePanel = () => {
  const preferences = [
    { type: 'email', label: 'Email Notifications', icon: <FaEnvelope /> },
    { type: 'sms', label: 'SMS Notifications', icon: <FaSms /> },
    { type: 'push', label: 'Push Notifications', icon: <FaBell /> }
  ];

  return (
    <div className="preference-panel">
      <h3>Communication Preferences</h3>
      <div className="preference-options">
        {preferences.map(pref => (
          <DraggablePreference
            key={pref.type}
            type={pref.type}
            label={pref.label}
            icon={pref.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default PreferencePanel; 