import React, { useState } from 'react';
import { 
  FaPalette, 
  FaRuler, 
  FaHeading, 
  FaImage, 
  FaFont, 
  FaTag, 
  FaSquare, 
  FaAlignLeft 
} from 'react-icons/fa';
import './DraggableItem.css';

const DraggableItem = ({ id, label, type, required, onStyleChange }) => {
  const [showInput, setShowInput] = useState(false);
  const [value, setValue] = useState(type === 'color' ? '#ffffff' : '');

  const getIcon = () => {
    switch (id) {
      case 'background':
        return <FaPalette />;
      case 'formWidth':
        return <FaRuler />;
      case 'heading':
        return <FaHeading />;
      case 'logo':
        return <FaImage />;
      case 'headingColor':
        return <FaFont />;
      case 'inputLabel':
        return <FaTag />;
      case 'buttonColor':
        return <FaSquare />;
      case 'buttonText':
        return <FaAlignLeft />;
      default:
        return null;
    }
  };

  const handleClick = () => {
    setShowInput(!showInput);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    onStyleChange && onStyleChange({
      type: id,
      value: newValue
    });
  };

  const renderInput = () => {
    switch (type) {
      case 'color':
        return (
          <div className="input-wrapper">
            <input
              type="color"
              value={value}
              onChange={handleInputChange}
              className="color-picker"
            />
            <input
              type="text"
              value={value}
              onChange={handleInputChange}
              placeholder="#ffffff"
              className="color-text-input"
            />
          </div>
        );
      case 'select':
        return (
          <div className="input-wrapper">
            <select 
              value={value} 
              onChange={handleInputChange} 
              className="control-input"
            >
              <option value="">Select width</option>
              <option value="400px">400px</option>
              <option value="600px">600px</option>
              <option value="800px">800px</option>
            </select>
          </div>
        );
      case 'text':
        return (
          <div className="input-wrapper">
            <input
              type="text"
              value={value}
              onChange={handleInputChange}
              placeholder={`Enter ${label.toLowerCase()}`}
              className="control-input"
            />
          </div>
        );
      case 'file':
        return (
          <div className="input-wrapper">
            <input
              type="file"
              onChange={handleInputChange}
              className="control-input"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="form-control-item">
      <button className="control-button" onClick={handleClick}>
        <div className="item-left">
          <div className="item-icon">
            {getIcon()}
          </div>
          <span className="item-label">
            {label}
            {required && <span className="required-indicator">*</span>}
          </span>
        </div>
        <div className="item-type">
          {type}
        </div>
      </button>
      {showInput && (
        <div className="input-container">
          {renderInput()}
        </div>
      )}
    </div>
  );
};

export default DraggableItem; 