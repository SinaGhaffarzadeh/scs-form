import React from 'react';
import SectionList from '../SectionList/SectionList';
import styles from './MainContent.module.css';
import { useApp } from '../../context/AppContext';

const MainContent = () => {
  const { isDrawerOpen } = useApp();

  return (
    <main className={`${styles.mainContent} ${isDrawerOpen ? styles.withSidebar : ''}`}>
      <SectionList />
    </main>
  );
};

export default MainContent;

