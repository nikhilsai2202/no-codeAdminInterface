import React from 'react';
import { useDrop } from 'react-dnd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaTrash, FaGripVertical, FaEnvelope, FaSms, FaBell } from 'react-icons/fa';
import './DropZone.css';

const DropZone = ({ 
  onDrop, 
  items, 
  onDelete, 
  onReorder, 
  isPreviewMode,
  formValues,
  formErrors,
  onValueChange,
  formStyles
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'formItem',
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    onReorder(result.source.index, result.destination.index);
  };

  // Get form style values
  const getFormStyles = () => {
    return {
      backgroundColor: formStyles.background || '#ffffff',
      width: formStyles.formWidth || '400px',
      margin: '0 auto',
      padding: '2rem',
      borderRadius: '8px',
      minHeight: '400px'
    };
  };

  const renderSubmitButton = () => {
    return (
      <div className="submit-button-container">
        <button 
          className="form-submit-button"
          style={{ 
            backgroundColor: formStyles.buttonColor || '#4299e1',
            color: '#ffffff'
          }}
        >
          {formStyles.buttonText || 'Submit'}
        </button>
      </div>
    );
  };

  const renderFormControl = (item) => {
    const value = formValues[item.id] || '';
    const error = formErrors[item.id];

    const handleInputChange = (e) => {
      const newValue = e.target.type === 'file' 
        ? e.target.files[0]?.name || '' 
        : e.target.value;
      onValueChange(item.id, newValue);
    };

    // Special handling for heading
    if (item.id.startsWith('heading')) {
      return (
        <div className="form-control heading-control">
          <h1 className="form-heading" style={{ color: formStyles.headingColor || '#000000' }}>
            {value || 'Enter Form Heading'}
          </h1>
        </div>
      );
    }

    if (item.type === 'preference') {
      return (
        <div className="preference-control">
          <div className="preference-header">
            <div className="preference-icon">
              {item.preferenceType === 'email' && <FaEnvelope />}
              {item.preferenceType === 'sms' && <FaSms />}
              {item.preferenceType === 'push' && <FaBell />}
            </div>
            <label htmlFor={item.id}>{item.label}</label>
          </div>
          <div className="preference-toggle" onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              id={item.id}
              checked={value || false}
              onChange={(e) => {
                e.stopPropagation();
                onValueChange(item.id, e.target.checked);
              }}
              disabled={isPreviewMode}
            />
            <span 
              className="toggle-slider"
              onClick={(e) => {
                e.stopPropagation();
                if (!isPreviewMode) {
                  onValueChange(item.id, !value);
                }
              }}
            ></span>
          </div>
        </div>
      );
    }

    const commonProps = {
      id: item.id,
      value: value,
      onChange: handleInputChange,
      className: `${item.type}-input ${error ? 'has-error' : ''}`,
      disabled: isPreviewMode
    };

    switch (item.type) {
      case 'color':
        return (
          <div className="form-control">
            <label htmlFor={item.id} style={{ color: 'var(--label-color)' }}>
              {item.label}
              {item.required && <span className="required">*</span>}
            </label>
            <input 
              type="color"
              {...commonProps}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
        );
      case 'select':
        return (
          <div className="form-control">
            <label htmlFor={item.id} style={{ color: 'var(--label-color)' }}>
              {item.label}
              {item.required && <span className="required">*</span>}
            </label>
            <select {...commonProps}>
              <option value="">Select width...</option>
              <option value="400px">400px</option>
              <option value="600px">600px</option>
              <option value="800px">800px</option>
            </select>
            {error && <span className="error-message">{error}</span>}
          </div>
        );
      case 'file':
        return (
          <div className="form-control">
            <label htmlFor={item.id} style={{ color: 'var(--label-color)' }}>
              {item.label}
              {item.required && <span className="required">*</span>}
            </label>
            <input 
              type="file"
              onChange={handleInputChange}
              className={`file-input ${error ? 'has-error' : ''}`}
              disabled={isPreviewMode}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
        );
      case 'text':
        return (
          <div className="form-control">
            <label htmlFor={item.id} style={{ color: 'var(--label-color)' }}>
              {item.label}
              {item.required && <span className="required">*</span>}
            </label>
            <input 
              type="text"
              {...commonProps}
              placeholder={`Enter ${item.label.toLowerCase()}`}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
        );
      default:
        return null;
    }
  };

  const PreferenceList = React.memo(({ items }) => {
    return (
      <Droppable droppableId="preferences-list">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="form-preview-container"
          >
            {items.map((item, index) => (
              <Draggable
                key={item.id}
                draggableId={item.id}
                index={index}
                isDragDisabled={isPreviewMode}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`preview-item ${snapshot.isDragging ? 'dragging' : ''}`}
                  >
                    {!isPreviewMode && (
                      <div className="item-actions">
                        <div 
                          {...provided.dragHandleProps}
                          className="drag-handle"
                          title="Drag to reorder"
                        >
                          <FaGripVertical />
                        </div>
                        <button 
                          className="delete-button"
                          onClick={() => onDelete(item.id)}
                          title="Delete item"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                    {renderFormControl(item)}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  });

  return (
    <div 
      ref={drop} 
      className={`drop-zone ${isOver ? 'is-over' : ''}`}
    >
      <div className="form-preview-wrapper" style={getFormStyles()}>
        {items.length === 0 ? (
          <div className="drop-placeholder">
            <p>Drag and drop form controls here</p>
          </div>
        ) : (
          <>
            {/* Render heading first */}
            {items.map(item => {
              if (item.id.includes('heading')) {
                return (
                  <div key={item.id} className="form-header">
                    {renderFormControl(item)}
                  </div>
                );
              }
              return null;
            })}
            
            {/* Render other items */}
            <DragDropContext onDragEnd={handleDragEnd}>
              <PreferenceList items={items.filter(item => !item.id.includes('heading'))} />
            </DragDropContext>

            {/* Render submit button */}
            {renderSubmitButton()}
          </>
        )}
      </div>
    </div>
  );
};

export default DropZone;