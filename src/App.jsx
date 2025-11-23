import React from 'react';
import { AppProvider } from './context/AppContext';
import Drawer from './components/Drawer/Drawer';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';

const AppContent = () => {

  return (
    <div className="app">
      <MainContent />
      <Drawer>
        <Sidebar />
      </Drawer>
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;

