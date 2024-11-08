import React, { useState, useEffect, useRef } from 'react';
import DraggableItem from './DraggableItem';
import DropZone from './DropZone';
import PreferencePanel from './PreferencePanel';
import './FormBuilder.css';

const FormBuilder = () => {
  const [formItems, setFormItems] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [preferences, setPreferences] = useState({
    email: true,
    sms: false,
    pushNotifications: false
  });
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const fileInputRef = useRef(null);
  const [formStyles, setFormStyles] = useState({
    background: '#ffffff',
    formWidth: '400px',
    heading: '',
    headingColor: '#000000',
    inputLabelColor: '#4a5568',
    buttonColor: '#4299e1',
    buttonText: 'Submit'
  });

  // Load saved configuration on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('formConfiguration');
    if (savedConfig) {
      const { formItems: savedItems, preferences: savedPrefs } = JSON.parse(savedConfig);
      setFormItems(savedItems);
      setPreferences(savedPrefs);
      
      // Initialize form values
      const initialValues = {};
      savedItems.forEach(item => {
        initialValues[item.id] = '';
      });
      setFormValues(initialValues);
    }
  }, []);

  const formControls = [
    { id: 'background', label: 'Background Color', type: 'color', defaultValue: '#ffffff', required: true },
    { id: 'formWidth', label: 'Form Width', type: 'select', defaultValue: '400px', required: true },
    { id: 'heading', label: 'Heading', type: 'text', defaultValue: '', required: true },
    { id: 'logo', label: 'Logo Image', type: 'file', defaultValue: '', required: false },
    { id: 'headingColor', label: 'Heading Font Color', type: 'color', defaultValue: '#000000', required: true },
    { id: 'inputLabel', label: 'Input Label Color', type: 'color', defaultValue: '#4a5568', required: true },
    { id: 'buttonColor', label: 'Submit Button Color', type: 'color', defaultValue: '#4299e1', required: true },
    { id: 'buttonText', label: 'Submit Button Text', type: 'text', defaultValue: 'Submit', required: true },
  ];

  const handleDrop = (item) => {
    // Check if it's a preference item
    if (item.type === 'preference') {
      // Generate a unique ID for each preference instance
      const uniqueId = `${item.id}-${Date.now()}`;
      const newPreferenceItem = {
        ...item,
        id: uniqueId,
        defaultValue: false // Set default value for preference toggles
      };
      
      setFormItems(prevItems => [...prevItems, newPreferenceItem]);
      setFormValues(prev => ({
        ...prev,
        [uniqueId]: false // Initialize the toggle state
      }));
    } else {
      // Handle non-preference items as before
      const newItem = { 
        ...item, 
        id: `${item.id}-${Date.now()}`,
        defaultValue: item.defaultValue || ''
      };
      setFormItems(prevItems => [...prevItems, newItem]);
      setFormValues(prev => ({
        ...prev,
        [newItem.id]: newItem.defaultValue
      }));
    }
  };

  const handlePreferenceChange = (type) => {
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleDeleteItem = (itemId) => {
    setFormItems(formItems.filter(item => item.id !== itemId));
    setFormValues(prev => {
      const newValues = { ...prev };
      delete newValues[itemId];
      return newValues;
    });
    setFormErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[itemId];
      return newErrors;
    });
  };

  const handleReorderItems = (startIndex, endIndex) => {
    const reorderedItems = Array.from(formItems);
    const [removed] = reorderedItems.splice(startIndex, 1);
    reorderedItems.splice(endIndex, 0, removed);
    setFormItems(reorderedItems);
  };

  const handleFormValueChange = (itemId, value) => {
    setFormValues(prev => ({
      ...prev,
      [itemId]: value
    }));
    
    // Clear error when value changes
    if (formErrors[itemId]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[itemId];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    formItems.forEach(item => {
      if (item.required && !formValues[item.id]) {
        errors[item.id] = `${item.label} is required`;
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveConfiguration = () => {
    if (!validateForm()) {
      alert('Please fill in all required fields');
      return;
    }

    const configuration = {
      formItems,
      preferences,
      formValues
    };
    localStorage.setItem('formConfiguration', JSON.stringify(configuration));
    alert('Form configuration saved successfully!');
  };

  const handleResetConfiguration = () => {
    if (window.confirm('Are you sure you want to reset the configuration? This cannot be undone.')) {
      localStorage.removeItem('formConfiguration');
      setFormItems([]);
      setFormValues({});
      setFormErrors({});
      setPreferences({
        email: true,
        sms: false,
        pushNotifications: false
      });
    }
  };

  const handleExportConfiguration = () => {
    const configuration = {
      formItems,
      preferences,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(configuration, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `form-config-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportConfiguration = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = e.target && e.target.result;
          if (typeof result === 'string') {
            const configuration = JSON.parse(result);
            setFormItems(configuration.formItems);
            setPreferences(configuration.preferences);
            alert('Configuration imported successfully!');
          }
        } catch (error) {
          alert('Error importing configuration. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStyleChange = (styleUpdate) => {
    if (styleUpdate.type === 'heading') {
      // Update form values for heading text
      setFormValues(prev => ({
        ...prev,
        'heading-text': styleUpdate.value
      }));
    } else {
      // Update form styles for other controls
      setFormStyles(prev => ({
        ...prev,
        [styleUpdate.type]: styleUpdate.value
      }));
    }
  };

  return (
    <div className="form-builder">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Form Controls</h2>
          <button 
            className="preview-toggle"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            {isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
          </button>
        </div>
        {!isPreviewMode && (
          <>
            <div className="controls-container">
              {formControls.map(control => (
                <DraggableItem 
                  key={control.id}
                  {...control}
                  onStyleChange={handleStyleChange}
                />
              ))}
            </div>
            <PreferencePanel 
              preferences={preferences}
              onChange={handlePreferenceChange}
            />
            <div className="button-group">
              <button 
                className="save-button"
                onClick={handleSaveConfiguration}
              >
                Save Configuration
              </button>
              <button 
                className="export-button"
                onClick={handleExportConfiguration}
              >
                Export Configuration
              </button>
              <button 
                className="import-button"
                onClick={handleImportClick}
              >
                Import Configuration
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                onChange={handleImportConfiguration}
              />
              <button 
                className="reset-button"
                onClick={handleResetConfiguration}
              >
                Reset Configuration
              </button>
            </div>
          </>
        )}
      </div>
      <div className="form-preview">
        <h2>Form Preview</h2>
        <DropZone 
          onDrop={handleDrop}
          items={formItems}
          onDelete={handleDeleteItem}
          onReorder={handleReorderItems}
          isPreviewMode={isPreviewMode}
          formValues={formValues}
          formErrors={formErrors}
          onValueChange={handleFormValueChange}
          formStyles={formStyles}
        />
      </div>
    </div>
  );
};

export default FormBuilder; 