import React from 'react';
import { useApp } from '../../context/AppContext';
import { useSwipeGesture } from '../../hooks/useSwipeGesture';
import styles from './Drawer.module.css';

const Drawer = ({ children }) => {
  const { isDrawerOpen, closeDrawer } = useApp();

  const swipeHandlers = useSwipeGesture(
    () => {
      if (isDrawerOpen) closeDrawer();
    },
    null
  );

  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.overlay} ${isDrawerOpen ? styles.overlayVisible : ''}`}
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div
        {...swipeHandlers}
        className={`${styles.drawer} ${isDrawerOpen ? styles.drawerOpen : ''}`}
      >
        {children}
      </div>
    </>
  );
};

export default Drawer;

