import { useApp } from '../context/AppContext';

export const useDrawer = () => {
  const { isDrawerOpen, toggleDrawer, openDrawer, closeDrawer } = useApp();
  
  return {
    isDrawerOpen,
    toggleDrawer,
    openDrawer,
    closeDrawer,
  };
};

