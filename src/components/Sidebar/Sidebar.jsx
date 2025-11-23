import React from 'react';
import { useApp } from '../../context/AppContext';
import ContactForm from '../ContactForm/ContactForm';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const { closeDrawer, selectedSection } = useApp();

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {selectedSection === 'form1' ? 'فرم تماس' : 'انتخاب کنید'}
        </h2>
        <button onClick={closeDrawer} className={styles.closeButton} aria-label="Close sidebar">
          ✕
        </button>
      </div>

      <div className={styles.content}>
        {selectedSection === 'form1' ? (
          <ContactForm />
        ) : (
          <div className={styles.emptyState}>
            <p>لطفاً یک بخش را از لیست انتخاب کنید</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

