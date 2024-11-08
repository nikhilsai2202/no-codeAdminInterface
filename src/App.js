import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FormBuilder from './components/FormBuilder';
import './App.css';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <header className="app-header">
          <h1>Preference Center Builder</h1>
        </header>
        <FormBuilder />
      </div>
    </DndProvider>
  );
}

export default App; 